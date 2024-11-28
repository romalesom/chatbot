/**
 * Adaptive Card data model for the card without responsible.
 * responsible: the person who assigned you
 */
export interface Responsibilities {
  title: string;
  properties: string;
  responsible: string;
  comment?: string;
  url: string;
}

/**
 * Adaptive Card data model for the default card.
 * properties: the activity you are required for
 */
export interface Activities {
  title: string;
  properties: string;
  responsible?: string;
  comment?: string;
  url: string;
}

/**
 * Adaptive Card data model for the card without work item.
 * 
 */
export interface Following {
  title: string;
  responsible: string;
  properties: string;
  comment: string;
  url: string;
}