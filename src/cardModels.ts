/**
 * Adaptive Card data model for the default card.
 */
export interface DefaultCardData {
  title: string;
  workItem: string;
  responsible: string;
  url: string;
}

/**
 * Adaptive Card data model for the card without responsible.
 */
export interface NoResponsibleCardData {
  title: string;
  workItem?: string;
  responsible?: string;
  url: string;
}

/**
 * Adaptive Card data model for the card without work item.
 */
export interface NoWorkItemCardData {
  title: string;
  responsible?: string;
  workItem?: string;
  url: string;
}