export declare const useTasks: (tenantId: string) => {
    tasks: any;
    loading: boolean;
    error: import("@apollo/client").ApolloError;
    createTask: (taskData: {
        title: string;
        description?: string;
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
        dueDate?: string;
        assignedToId?: string;
    }) => Promise<any>;
    updateTask: (id: string, taskData: {
        title?: string;
        description?: string;
        status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
        dueDate?: string;
        assignedToId?: string;
    }) => Promise<any>;
    deleteTask: (id: string) => Promise<any>;
    subscriptionData: any;
};
//# sourceMappingURL=useTasks.d.ts.map