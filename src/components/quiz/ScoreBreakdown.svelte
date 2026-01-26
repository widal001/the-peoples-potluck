<script lang="ts">
  import type { AxisCounts } from "@/config/quiz/types";
  import { getConfidenceScores, getConfidenceDescription } from "@/lib/quiz";
  import FlavorScoreGrid from "@/components/shared/FlavorScoreGrid.svelte";

  export let axisCounts: AxisCounts;
  export let title: string = "How You Scored";

  // Calculate confidence for each axis
  $: confidenceScores = getConfidenceScores(axisCounts);

  // Axis label config for explanations
  const axisLabels = {
    heat: { high: "spicy", low: "mild" },
    sweet: { high: "sweet", low: "bitter" },
    zest: { high: "bold", low: "subtle" },
    heft: { high: "hearty", low: "light" },
  };

  // Convert counts to a 1-5 score (high count = 5, low count = 1)
  function getNormalizedScore(counts: { high: number; low: number }): number {
    const total = counts.high + counts.low;
    if (total === 0) return 3;
    const ratio = counts.high / total;
    const score = Math.round(ratio * 4) + 1;
    return Math.max(1, Math.min(5, score));
  }

  // Get the winning side
  function getWinner(counts: { high: number; low: number }): "high" | "low" {
    return counts.high >= counts.low ? "high" : "low";
  }

  // Generate explanation based on score and confidence
  function getExplanation(
    axis: keyof typeof axisLabels,
    score: number,
    confidence: number
  ): string {
    const labels = axisLabels[axis];
    const winner = score >= 3 ? "high" : "low";
    const winnerLabel = labels[winner];
    const strengthWord = getConfidenceDescription(confidence);

    const explanationTemplates: Record<number, string> = {
      1: `You have a ${strengthWord} preference for ${winnerLabel} engagement`,
      2: `You lean toward ${winnerLabel} approaches`,
      3: `You're balanced between ${labels.low} and ${labels.high}`,
      4: `You lean toward ${winnerLabel} approaches`,
      5: `You have a ${strengthWord} preference for ${winnerLabel} engagement`,
    };

    return explanationTemplates[score];
  }

  // Computed scores
  $: heatScore = getNormalizedScore(axisCounts.heat);
  $: sweetScore = getNormalizedScore(axisCounts.sweet);
  $: zestScore = getNormalizedScore(axisCounts.zest);
  $: heftScore = getNormalizedScore(axisCounts.heft);

  // Computed explanations
  $: heatExplanation = getExplanation("heat", heatScore, confidenceScores.heat);
  $: sweetExplanation = getExplanation("sweet", sweetScore, confidenceScores.sweet);
  $: zestExplanation = getExplanation("zest", zestScore, confidenceScores.zest);
  $: heftExplanation = getExplanation("heft", heftScore, confidenceScores.heft);
</script>

<FlavorScoreGrid
  {title}
  heat={heatScore}
  sweet={sweetScore}
  zest={zestScore}
  heft={heftScore}
  {heatExplanation}
  {sweetExplanation}
  {zestExplanation}
  {heftExplanation}
/>
