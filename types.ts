
export interface TripPlan {
  destination: string;
  duration: string;
  activities: string[];
  itinerary: { day: number; schedule: string[] }[];
}

export interface BudgetEstimate {
  total: number;
  breakdown: {
    flights: number;
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
  };
  currency: string;
}

export interface SocialGroup {
  id: string;
  name: string;
  members: number;
  destination: string;
  type: 'roadtrip' | 'city' | 'nature';
  isJoined?: boolean;
}

export interface FriendPosition {
  id: string;
  name: string;
  distanceToTarget: number; // in km
  status: 'moving' | 'arrived' | 'stalled';
  avatar: string;
}

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  PLANNER = 'PLANNER',
  BUDGET = 'BUDGET',
  SOCIAL = 'SOCIAL',
  RACE = 'RACE',
  NEARBY = 'NEARBY'
}
