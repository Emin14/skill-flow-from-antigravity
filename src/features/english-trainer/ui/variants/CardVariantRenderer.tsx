'use client';

import React from 'react';
import { BaseWordCardProps } from './types';
import { Variant1MasterDotsCard } from './Variant15GlassmorphismUnderline';
import { Variant14SegmentedPillCard as Variant2SideArrowsTrackCard } from './Variant14SegmentedPillCard';

export interface CardVariantRendererProps extends BaseWordCardProps {
  variantId: number;
}

export const CardVariantRenderer: React.FC<CardVariantRendererProps> = (props) => {
  const { variantId } = props;

  switch (variantId) {
    case 1:
      return <Variant1MasterDotsCard {...props} />;
    case 2:
    default:
      return <Variant2SideArrowsTrackCard {...props} />;
  }
};
