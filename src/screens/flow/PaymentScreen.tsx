import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../styles";
import { PaymentMethod } from "../../types/home";

export default function PaymentScreen({ methods, selectedId, onSelect, onBack, onContinue, onAddCard, onDelete }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}><Text style={styles.headerBackText}>←</Text></TouchableOpacity>
        <View style={styles.headerCenterAbsolute}><Text style={styles.headerTitle}>Ödeme Yöntemi</Text></View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Kayıtlı Kartlarım</Text>
        {methods.map((method: PaymentMethod) => {
          const isSelected = selectedId === method.id;
          return (
            <TouchableOpacity key={method.id} style={[styles.selectionCard, isSelected && styles.selectionCardActive]} onPress={() => onSelect(method.id)}>
               <View style={styles.selectionHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.radioIcon}>{isSelected ? "◉" : "○"}</Text>
                  <Text style={styles.selectionTitle}>{method.label}</Text>
                </View>
                <TouchableOpacity onPress={() => onDelete(method.id)}><Text style={styles.deleteText}>Sil</Text></TouchableOpacity>
              </View>
              <Text style={styles.selectionDetail}>{method.description}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.dashedButton} onPress={onAddCard}><Text style={styles.dashedButtonText}>+ Yeni Kart Ekle</Text></TouchableOpacity>
      </ScrollView>
      <View style={styles.footerSimple}>
        <TouchableOpacity style={styles.primaryButton} onPress={onContinue}><Text style={styles.primaryButtonText}>Onayla ve İlerle</Text></TouchableOpacity>
      </View>
    </View>
  );
}
