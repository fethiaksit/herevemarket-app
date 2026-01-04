import React from "react";
import { View, ScrollView, Image } from "react-native";
import { styles } from "../styles";

export default function HomeSlider({
  dailyDeals,
  sliderRef,
  slideWidth,
  activeDealIndex,
  setActiveDealIndex,
}: {
  dailyDeals: number[];
  sliderRef: React.RefObject<ScrollView>;
  slideWidth: number;
  activeDealIndex: number;
  setActiveDealIndex: (value: number) => void;
}) {
  return (
    <View style={styles.sliderContainer}>
        <ScrollView ref={sliderRef} horizontal showsHorizontalScrollIndicator={false} snapToInterval={slideWidth} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: 0 }} onMomentumScrollEnd={(e) => setActiveDealIndex(Math.round(e.nativeEvent.contentOffset.x / slideWidth))}>
            {dailyDeals.map((img, i) => (
                <View key={i} style={[styles.slideItem, { width: slideWidth }]}>
                    <Image source={img} style={styles.slideImage} resizeMode="cover" />
                </View>
            ))}
        </ScrollView>
        <View style={styles.dotsContainer}>{dailyDeals.map((_, i) => (<View key={i} style={[styles.dot, i === activeDealIndex && styles.dotActive]} />))}</View>
    </View>
  );
}
