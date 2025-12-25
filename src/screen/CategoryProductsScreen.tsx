import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
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

  const handleIncrease = (product: ProductDto) => {
    if (!product.inStock || product.stock === 0) {
      Alert.alert("Bu ürün stokta bulunmuyor");
      return;
    }
    increase(product.id);
  };

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
            const outOfStock = !urun.inStock || urun.stock === 0;

            return (
              <View
                key={urun.id}
                style={[styles.productCard, outOfStock && styles.productCardDisabled]}
              >
                <Image
                  source={urun.image ? { uri: urun.image } : placeholderImage}
                  style={styles.productImage}
                />

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {urun.name}
                  </Text>
                  {urun.brand ? <Text style={styles.productBrand}>{urun.brand}</Text> : null}
                  {outOfStock ? <Text style={styles.outOfStockBadge}>TÜKENDİ</Text> : null}

                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>
                      {formatPrice(urun.price)}
                    </Text>

                    {quantity === 0 ? (
                      <TouchableOpacity
                        style={[
                          styles.addButton,
                          outOfStock && styles.addButtonDisabled,
                        ]}
                        onPress={() => handleIncrease(urun)}
                        disabled={outOfStock}
                      >
                        <Text
                          style={[
                            styles.addButtonText,
                            outOfStock && styles.addButtonTextDisabled,
                          ]}
                        >
                          {outOfStock ? "Stokta Yok" : "Sepete Ekle"}
                        </Text>
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
                          onPress={() => handleIncrease(urun)}
                          style={[
                            styles.counterButton,
                            outOfStock && styles.counterButtonDisabled,
                          ]}
                          disabled={outOfStock}
                        >
                          <Text
                            style={[
                              styles.counterText,
                              outOfStock && styles.counterTextDisabled,
                            ]}
                          >
                            +
                          </Text>
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
