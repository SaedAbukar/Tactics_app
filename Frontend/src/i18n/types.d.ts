import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: {
        save: string;
        add: string;
        delete: string;
        cancel: string;
        logout: string;
        back: string;
        retry: string;
        error: string;
      };
      header: {
        appName: string;
        homeLink: string;
        exercises: string;
        tacticalBoardLink: string;
        language: string;
        english: string;
        finnish: string;
        spanish: string;
        german: string;
        french: string;
        login: string;
        logout: string;
        profile: string;
      };
      home: {
        hero: {
          welcome_back: string;
          elevate_title: string;
          ready_desc: string;
          logged_out_desc: string;
          cta_dashboard: string;
          cta_start: string;
          cta_login: string;
        };
        cards: {
          tactical_title: string;
          tactical_desc: string;
          session_title: string;
          session_desc: string;
          session_sub: string;
          profile_title: string;
          profile_desc_user: string;
          profile_desc_guest: string;
        };
        items_one: string;
        items_other: string;
        greeting: string;
      };
      profile: {
        memberSince: string;
        lastLogin: string;
        stats: {
          sessions: string;
          practices: string;
          tactics: string;
        };
        actions: {
          edit: string;
          logout: string;
        };
        loading: string;
        na: string; // For "N/A" dates
      };
      footer: { copyright: string };
      exercises: {
        title: string;
        subtitle: string;
        tabs: {
          sessions: string;
          practices: string;
          tactics: string;
        };
        columns: {
          personal: string;
          shared: string;
          group: string;
          empty: string;
        };
        detail: {
          preview: string;
          description: string;
          included: string;
          addSession: string;
          noDescription: string;
          noSessions: string;
          selectPrompt: string;
          choose: string;
        };
      };
      tacticalEditor: {
        step: string;
        editing: string;
        noSteps: string;
        editorTools: string;
        tools: string;
        sessionAlreadyAdded: string;
        stepAdded: string;
        stepUpdated: string;
        saveStep: string;
        play: string;
        pause: string;
        continue: string;
        resume: string;
        stop: string;
        clearPitch: string;
        useUserData: string;
        useMockData: string;
        colors: {
          white: string;
          black: string;
          blue: string;
          red: string;
          yellow: string;
          purple: string;
          orange: string;
          cyan: string;
          pink: string;
        };
        sessionSelector: {
          manageViewType: string;
          namePlaceholder: string;
          descriptionPlaceholder: string;
          add: string;
          saveUpdate: string;
          select: string;
          addSessionPlaceholder: string;
          update: string;
          delete: string;
          loading: string;
          create: string;
          new: string;
          personal: string;
          shared: string;
          group: string;
          empty: string;
          attachedSessions: string;
          addAttached: string;
          save: string;
          cancel: string;
          validationError: string;
          practiceLabel: string;
          tacticLabel: string;
          cannotDeleteTitle: string;
          cannotDeleteMessage: string;
          deleteTitle: string;
          deleteMessage: string;
          deleteConfirm: string;
          ok: string;
          tabSessions: string;
          tabPractices: string;
          tabTactics: string;
        };
        controls: {
          objects: string;
          noTeam: string;
          saveTeam: string;
          color: string;
          animationLabel: string;
          createTeam: string;
          teamNamePlaceholder: string;
          addTeam: string;
          players: string;
          addPlayers: string;
          balls: string;
          addBalls: string;
          goals: string;
          addGoals: string;
          cones: string;
          addCones: string;
          animation: string;
          speed: string;
          resetSpeed: string;
          clearPitch: string;
        };
        formationSelector: {
          teamLabel: string;
          formationLabel: string;
          noTeamOption: string;
          selectFormationOption: string;
          addFormation: string;
          selectTeamAlert: string;
          selectFormationAlert: string;
          invalidFormationAlert: string;
          noPositionsAlert: string;
        };
      };
    };
  }
}
