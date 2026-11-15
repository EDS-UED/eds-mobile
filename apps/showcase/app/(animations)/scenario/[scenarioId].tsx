import { useLocalSearchParams } from 'expo-router';

import { MotionScenarioDetailView } from '@/views/animations/MotionScenarioDetailView';

export default function MotionScenarioScreen() {
  const { scenarioId } = useLocalSearchParams<{ scenarioId: string }>();
  return <MotionScenarioDetailView scenarioId={scenarioId ?? ''} />;
}