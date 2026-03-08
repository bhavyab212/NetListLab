import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ContributionProposal {
    id: string;
    forkProjectId: number;
    upstreamProjectId: number;
    authorId: string;
    author: string;
    title: string;
    description: string;
    status: 'open' | 'merged' | 'closed';
    changes: string[]; // summary of changes
    createdAt: string;
    updatedAt: string;
}

interface ContributionState {
    proposals: ContributionProposal[];

    // Actions
    createProposal: (data: Omit<ContributionProposal, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => string;
    mergeProposal: (id: string) => void;
    closeProposal: (id: string) => void;
    reopenProposal: (id: string) => void;

    // Selectors
    getProposalsForProject: (projectId: number) => ContributionProposal[];
    getMyProposals: (authorId: string) => ContributionProposal[];
}

export const useContributionStore = create<ContributionState>()(
    persist(
        (set, get) => ({
            proposals: [],

            createProposal: (data) => {
                const id = `prop-${Date.now()}`;
                const newProposal: ContributionProposal = {
                    ...data,
                    id,
                    status: 'open',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                set((state) => ({
                    proposals: [newProposal, ...state.proposals]
                }));

                return id;
            },

            mergeProposal: (id) => set((state) => ({
                proposals: state.proposals.map(p =>
                    p.id === id ? { ...p, status: 'merged', updatedAt: new Date().toISOString() } : p
                )
            })),

            closeProposal: (id) => set((state) => ({
                proposals: state.proposals.map(p =>
                    p.id === id ? { ...p, status: 'closed', updatedAt: new Date().toISOString() } : p
                )
            })),

            reopenProposal: (id) => set((state) => ({
                proposals: state.proposals.map(p =>
                    p.id === id ? { ...p, status: 'open', updatedAt: new Date().toISOString() } : p
                )
            })),

            getProposalsForProject: (projectId: number) => {
                const { proposals } = get();
                return proposals.filter(p => p.upstreamProjectId === projectId || p.forkProjectId === projectId);
            },

            getMyProposals: (authorId: string) => {
                const { proposals } = get();
                return proposals.filter(p => p.authorId === authorId);
            }
        }),
        {
            name: 'netlistlab-contributions'
        }
    )
);
