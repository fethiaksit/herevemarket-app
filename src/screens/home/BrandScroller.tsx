import React from "react";
import { ScrollView, View, Image } from "react-native";
import { styles } from "../styles";
import { Brand } from "../../types/home";

export default function BrandScroller({ markalar }: { markalar: Brand[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandScroll} contentContainerStyle={{paddingHorizontal: 16}}>
        {markalar.map((m, i) => (<View key={i} style={styles.brandCircle}><Image source={m.image} style={styles.brandImg} resizeMode="contain" /></View>))}
    </ScrollView>
  );
}
