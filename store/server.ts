import { create } from "zustand";

type Count = {
    itms_event_count: number;
    ivms_event_count: number;
    time_range: string;
}

type State = {
    serverCounts: {
        [key: string]: Count
    };
    displayServerData: boolean;
}

type Actions = {
    pushCount: (count: Count) => void;
    reset: () => void;
    setDisplayServerData: (val: boolean) => void;
}

const useServer = create<State & Actions>((set) => ({
    serverCounts: {},
    displayServerData: false,
    setDisplayServerData: (val) => set(() => ({ displayServerData: val })),
    pushCount: (count) => set((state) => ({
        serverCounts: {...state.serverCounts, [count.time_range]: count}
    })),
    reset: () => set(() => ({ serverCounts: {} }))
}))

export default useServer