/**
 * Adaptive Card data model for the card without responsible.
 * responsible: the person who assigned you
 */
export interface Responsibilities {
  title: string;
  workItem: string;
  responsible: string;
  comment?: string;
  url: string;
}

/**
 * Adaptive Card data model for the default card.
 * workItem: the activity you are required for
 */
export interface Activities {
  title: string;
  workItem: string;
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
  workItem: string;
  comment: string;
  url: string;
}