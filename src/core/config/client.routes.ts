const ROUTES = {
  USERS: {
    PARTICIPANTS: {
      MAIN: "/users/participants",
      DETAIL: (id: string) => `/users/participants/${id}`,
      QUESTIONNAIRES: (id: string) =>
        `/users/participants/${id}/questionnaires`,
      EVALUATIONS: (id: string) => `/users/participants/${id}/evaluations`,
    },
  },

  EVALUATIONS: {
    FTSTS: "/5tsts",
    TTSTS: "/30sts",
    FTSTS_BY_ID: (id: string) => `/5tsts/${id}`,
    TTSTS_BY_ID: (id: string) => `/30sts/${id}`,
  },
};

export default ROUTES;
