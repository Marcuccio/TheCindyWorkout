(() => {
  const PRESCRIBED_RECIPE = {
    pullups: 5,
    pushups: 10,
    squats: 15,
  };

  const guide = [
    {
      key: "beginner",
      label: "Beginner",
      range: "8+ rounds",
      standard: "Scaled",
      description: "Build steady movement quality with a modified recipe.",
    },
    {
      key: "intermediate",
      label: "Intermediate",
      range: "8-19 rounds",
      standard: "Prescribed",
      description: "Complete the standard 5 / 10 / 15 recipe consistently.",
    },
    {
      key: "rxd",
      label: "Rx'd",
      range: "20-24 rounds",
      standard: "Prescribed",
      description: "Sustain at least one full standard round per minute.",
    },
    {
      key: "elite",
      label: "Elite",
      range: "25+ rounds",
      standard: "Prescribed",
      description: "Hold an exceptional pace for the full 20 minutes.",
    },
  ];

  function isPrescribed(recipe) {
    return Object.entries(PRESCRIBED_RECIPE).every(
      ([movement, reps]) => Number(recipe?.[movement]) === reps,
    );
  }

  function classify(rounds, recipe) {
    const completedRounds = Math.max(0, Number(rounds) || 0);
    const prescribed = isPrescribed(recipe);

    if (prescribed && completedRounds >= 25) {
      return {
        ...guide[3],
        prescribed,
        next: "Keep refining transitions and movement efficiency.",
      };
    }

    if (prescribed && completedRounds >= 20) {
      return {
        ...guide[2],
        prescribed,
        next: `${25 - completedRounds} more round${completedRounds === 24 ? "" : "s"} to Elite.`,
      };
    }

    if (prescribed && completedRounds >= 8) {
      return {
        ...guide[1],
        prescribed,
        next: `${20 - completedRounds} more round${completedRounds === 19 ? "" : "s"} to Rx'd.`,
      };
    }

    if (!prescribed && completedRounds >= 8) {
      return {
        ...guide[0],
        prescribed,
        next: "Progress toward the standard 5 / 10 / 15 recipe.",
      };
    }

    return {
      key: "building",
      label: "Building",
      range: "Under 8 rounds",
      standard: prescribed ? "Prescribed" : "Scaled",
      description: "Establish a sustainable Cindy pace and clean repetitions.",
      prescribed,
      next: `${8 - completedRounds} more round${completedRounds === 7 ? "" : "s"} to reach the first benchmark.`,
    };
  }

  window.CindyScoring = { classify, guide, isPrescribed };
})();
