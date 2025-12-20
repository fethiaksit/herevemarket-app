import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { categoryStyles as styles } from "../styles/categories.styles";
import { CategoryDto, getCategories } from "../services/api/categories";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError((err as Error).message ?? "Kategoriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderItem = ({ item }: { item: CategoryDto }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kategoriler</Text>
      <Text style={styles.subheader}>
        Aktif kategoriler herkese açık olarak listelenir.
      </Text>

      {loading && <Text style={styles.loader}>Kategoriler yükleniyor...</Text>}
      {error && !loading && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={fetchCategories}
          ListEmptyComponent={
            <Text style={styles.loader}>Gösterilecek kategori bulunamadı.</Text>
          }
        />
      )}

      {!loading && (
        <TouchableOpacity style={styles.refreshButton} onPress={fetchCategories}>
          <Text style={styles.refreshText}>Tekrar Yükle</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
