import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/cartPrice";
import { RootStackParamList } from "../navigation/types";
import { styles } from "../styles/home.styles";
import { ProductDto } from "../services/api/products";

const placeholderImage = require("../../assets/logo.png");

export default function CategoryProductsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { increase, decrease, getQuantity } = useCart();
  const route = useRoute<RouteProp<RootStackParamList, "CategoryProducts">>();
  const { categoryId, categoryName, products } = route.params;

  const categoryTargets = useMemo(
    () => new Set([categoryId, categoryName].filter(Boolean)),
    [categoryId, categoryName]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product: ProductDto) =>
      product.category.some((category: string) => categoryTargets.has(category))
    );
  }, [categoryTargets, products]);

  return (
    <View style={styles.page}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cartBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cartBackText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>{categoryName}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.products}>
          <Text style={styles.sectionTitle}>{categoryName} Ürünleri</Text>

          {filteredProducts.length === 0 && (
            <Text style={styles.cartEmptyText}>
              Bu kategoriye ait ürün bulunamadı.
            </Text>
          )}

          {filteredProducts.map((urun: ProductDto) => {
            const quantity = getQuantity(urun.id);

            return (
              <View key={urun.id} style={styles.productCard}>
                <Image
                  source={urun.image ? { uri: urun.image } : placeholderImage}
                  style={styles.productImage}
                />

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {urun.name}
                  </Text>

                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>
                      {formatPrice(urun.price)}
                    </Text>

                    {quantity === 0 ? (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => increase(urun.id)}
                      >
                        <Text style={styles.addButtonText}>Sepete Ekle</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.counter}>
                        <TouchableOpacity
                          onPress={() => decrease(urun.id)}
                          style={styles.counterButton}
                        >
                          <Text style={styles.counterText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{quantity}</Text>
                        <TouchableOpacity
                          onPress={() => increase(urun.id)}
                          style={styles.counterButton}
                        >
                          <Text style={styles.counterText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
