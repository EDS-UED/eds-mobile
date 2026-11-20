import { useLocalSearchParams } from 'expo-router';

import { SceneAnimationDetailView } from '@/views/animations/SceneAnimationDetailView';

export default function SceneAnimationScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <SceneAnimationDetailView slug={slug ?? ''} />;
}