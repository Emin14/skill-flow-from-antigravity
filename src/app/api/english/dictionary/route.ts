import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getOxfordDictionary } from '@/entities/english';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const level = (searchParams.get('level') || 'ALL').toUpperCase();
    const status = (searchParams.get('status') || 'ALL').toUpperCase();
    const requestedSort = searchParams.get('sort') || 'relevance';
    const validSorts = new Set([
      'relevance',
      'frequency-asc',
      'frequency-desc',
      'alphabetical-asc',
      'alphabetical-desc',
      'level-asc',
      'level-desc',
      'status',
    ]);
    const sort = validSorts.has(requestedSort) ? requestedSort : 'relevance';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '30', 10)));

    // Load progress map
    const progressList = await prisma.englishWordProgress.findMany();
    const progressMap = new Map(progressList.map((p) => [p.wordId, p]));

    const dictionary = getOxfordDictionary();
    let filtered = dictionary;

    // Filter by search query (word or russian translation)
    if (q) {
      filtered = filtered.filter((w) => {
        const matchesWord = w.word.toLowerCase().includes(q);
        const matchesTranslation = w.translations.some((t) =>
          t.meanings.some((m) => m.toLowerCase().includes(q))
        );
        return matchesWord || matchesTranslation;
      });

      // Sort by search relevance
      filtered.sort((a, b) => {
        const aWord = a.word.toLowerCase();
        const bWord = b.word.toLowerCase();

        // 1. Exact match
        if (aWord === q && bWord !== q) return -1;
        if (bWord === q && aWord !== q) return 1;

        // 2. Starts with query
        if (aWord.startsWith(q) && !bWord.startsWith(q)) return -1;
        if (bWord.startsWith(q) && !aWord.startsWith(q)) return 1;

        // 3. Word matches before translation matches
        const aMatchesWord = aWord.includes(q);
        const bMatchesWord = bWord.includes(q);
        if (aMatchesWord && !bMatchesWord) return -1;
        if (!aMatchesWord && bMatchesWord) return 1;

        // 4. Shorter word first
        return aWord.length - bWord.length;
      });
    }

    // Filter by CEFR Level
    if (level !== 'ALL') {
      filtered = filtered.filter((w) => w.cefrLevel === level);
    }

    // Filter by User Learning Status
    if (status !== 'ALL') {
      filtered = filtered.filter((w) => {
        const userStatus = progressMap.get(w.id)?.status || 'NEW';
        return userStatus === status;
      });
    }

    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const statusOrder = ['NEW', 'LEARNING', 'REVIEW', 'MASTERED'];
    if (sort === 'frequency-asc' || sort === 'frequency-desc') {
      filtered.sort((a, b) => {
        const result = a.frequencyRank - b.frequencyRank;
        return sort === 'frequency-asc' ? result : -result;
      });
    } else if (sort === 'alphabetical-asc' || sort === 'alphabetical-desc') {
      filtered.sort((a, b) => {
        const result = a.word.localeCompare(b.word);
        return sort === 'alphabetical-asc' ? result : -result;
      });
    } else if (sort === 'level-asc' || sort === 'level-desc') {
      filtered.sort((a, b) => {
        const result = levelOrder.indexOf(a.cefrLevel) - levelOrder.indexOf(b.cefrLevel);
        return sort === 'level-asc' ? result : -result;
      });
    } else if (sort === 'status') {
      filtered.sort((a, b) => {
        const aStatus = progressMap.get(a.id)?.status || 'NEW';
        const bStatus = progressMap.get(b.id)?.status || 'NEW';
        return statusOrder.indexOf(aStatus) - statusOrder.indexOf(bStatus) || a.word.localeCompare(b.word);
      });
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedWords = filtered.slice(startIndex, startIndex + limit).map((w) => {
      const prog = progressMap.get(w.id);
      return {
        ...w,
        status: prog?.status || 'NEW',
        repetitions: prog?.repetitions ?? 0,
      };
    });

    return NextResponse.json({
      words: paginatedWords,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: startIndex + limit < total,
    });
  } catch (error) {
    console.error('Error querying English dictionary:', error);
    return NextResponse.json({ error: 'Failed to search dictionary' }, { status: 500 });
  }
}
