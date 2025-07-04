import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Listing, Sale, BulletinPost } from '../types';

interface AppState {
  user: User | null;
  listings: Listing[];
  sales: Sale[];
  bulletinPosts: BulletinPost[];
  isDarkMode: boolean;
  currentSlogan: string;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LISTINGS'; payload: Listing[] }
  | { type: 'ADD_LISTING'; payload: Listing }
  | { type: 'UPDATE_LISTING'; payload: Listing }
  | { type: 'DELETE_LISTING'; payload: string }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'SET_BULLETIN_POSTS'; payload: BulletinPost[] }
  | { type: 'ADD_BULLETIN_POST'; payload: BulletinPost }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_SLOGAN'; payload: string };

const slogans = [
  "Fresh Deals. Everyday.",
  "Because fresh things move fast.",
  "Your neighborhood marketplace",
  "Where trust meets commerce",
  "Local deals, global quality"
];

const initialState: AppState = {
  user: null,
  listings: [],
  sales: [],
  bulletinPosts: [],
  isDarkMode: false,
  currentSlogan: slogans[0]
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LISTINGS':
      return { ...state, listings: action.payload };
    case 'ADD_LISTING':
      return { ...state, listings: [action.payload, ...state.listings] };
    case 'UPDATE_LISTING':
      return {
        ...state,
        listings: state.listings.map(listing =>
          listing.id === action.payload.id ? action.payload : listing
        )
      };
    case 'DELETE_LISTING':
      return {
        ...state,
        listings: state.listings.filter(listing => listing.id !== action.payload)
      };
    case 'SET_SALES':
      return { ...state, sales: action.payload };
    case 'ADD_SALE':
      return { ...state, sales: [action.payload, ...state.sales] };
    case 'SET_BULLETIN_POSTS':
      return { ...state, bulletinPosts: action.payload };
    case 'ADD_BULLETIN_POST':
      return { ...state, bulletinPosts: [action.payload, ...state.bulletinPosts] };
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_SLOGAN':
      return { ...state, currentSlogan: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  slogans: string[];
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch, slogans }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};