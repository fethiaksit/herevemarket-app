import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { THEME } from "../../constants/theme";
import { styles } from "../styles";
import { CategoryDto } from "../../services/api/categories";
import { Screen } from "../../types/home";

export default function HomeHeader({
  isCategoryScreen,
  setActiveScreen,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  navigation,
  isGuest,
  token,
  handleAccountPress,
  categoryListRef,
}: {
  isCategoryScreen: boolean;
  setActiveScreen: React.Dispatch<React.SetStateAction<Screen>>;
  categories: CategoryDto[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<string | null>>;
  navigation: any;
  isGuest: boolean;
  token: string | null;
  handleAccountPress: () => void;
  categoryListRef: React.RefObject<ScrollView>;
}) {
  return (
    <View style={styles.mainHeader}>
         <View style={styles.logoRow}>
             {isCategoryScreen && (
                 <TouchableOpacity onPress={() => setActiveScreen("home")} style={{marginRight: 10, position: 'absolute', left: 16, zIndex: 10}}>
                     <Text style={{color: THEME.white, fontSize: 24}}>←</Text>
                 </TouchableOpacity>
             )}
             <View style={styles.headerLogoContainer}>
                <Image source={require("../../../assets/herevemarket2.png")} style={styles.headerLogo} resizeMode="contain" />
             </View>
         </View>
         <View style={styles.accountRow}>
            {!isGuest && token ? (
              <>
                <TouchableOpacity style={styles.accountButton} onPress={() => navigation.navigate("AddressList")}>
                  <Text style={styles.accountButtonText}>Adreslerim</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.accountButton} onPress={handleAccountPress}>
                  <Text style={styles.accountButtonText}>Hesabım</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.accountButton} onPress={handleAccountPress}>
                <Text style={styles.accountButtonText}>👤 Giriş Yap</Text>
              </TouchableOpacity>
            )}
         </View>
         <View style={styles.categoryContainer}>
            <ScrollView ref={categoryListRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 16, paddingVertical: 10}}>
                {categories.map(cat => (
                    <TouchableOpacity key={cat.id} style={[styles.categoryPill, selectedCategoryId === cat.id && styles.categoryPillActive]} onPress={() => { setSelectedCategoryId(cat.id); if (!isCategoryScreen) setActiveScreen("category"); }}>
                        <Text style={[styles.categoryPillText, selectedCategoryId === cat.id && styles.categoryPillTextActive]}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
         </View>
    </View>
  );
}
