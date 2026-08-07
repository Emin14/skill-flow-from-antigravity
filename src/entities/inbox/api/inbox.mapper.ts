import { InboxItem as PrismaInboxItem } from '@prisma/client';
import { InboxItem } from '../model/types';

export class InboxMapper {
  static toDto(prismaInbox: PrismaInboxItem): InboxItem {
    return {
      id: prismaInbox.id,
      text: prismaInbox.text,
      isPinned: prismaInbox.isPinned,
      createdAt: prismaInbox.createdAt instanceof Date ? prismaInbox.createdAt.toISOString() : String(prismaInbox.createdAt),
    };
  }
}
