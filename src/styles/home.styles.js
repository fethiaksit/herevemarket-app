import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    backgroundColor: "#fff",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e8ef",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  contentScroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    margin: 0,
    paddingVertical: 12,
    
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000080",
  },

  categoryBar: {
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingLeft: 10,
  },
  categoryRow: {
    paddingRight: 10,
    alignItems: "center",
  },
  categoryStickyHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e6e8ef",
    zIndex: 5,
  },
  categoryBackButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#e8ecfa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  categoryBackText: {
    fontSize: 18,
    color: "#000080",
    fontWeight: "bold",
  },
  categoryHeaderScroll: {
    flex: 1,
  },
  categoryHeaderRow: {
    paddingRight: 10,
    alignItems: "center",
  },
  categoryProductsScroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  categoryProductsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 24,
    paddingTop: 16,
  },
  categoryCard: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#FFD700",
    borderRadius: 12,
    marginRight: 12,
  },
  categoryCardActive: {
    backgroundColor: "#000080",
  },
  categoryText: {
    color: "#000080",
    fontWeight: "bold",
    fontSize: 15,
  },
  categoryTextActive: {
    color: "#FFD700",
  },

  brandScroll: {
    paddingHorizontal: 10,
    marginTop: 16,
  },
  brandChip: {
    width: 88,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#FFD700",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  brandImage: {
    width: "100%",
    height: "100%",
  },

  bannerWrapper: {
    marginTop: 10,
    alignItems: "center",
  },
  banner: {
    backgroundColor: "#000080",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  bannerImage: {
    width: "80%",
    height: 140,
  },
  bannerText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
  bannerDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e6e8ef",
  },
  bannerDotActive: {
    backgroundColor: "#FFD700",
    width: 16,
  },

  products: {
    marginTop: 24,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000080",
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  productBrand: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000080",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  productCardDisabled: {
    opacity: 0.5,
  },
  outOfStockBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ef4444",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    overflow: "hidden",
  },
  
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
  
  addButtonText: {
    color: "#000080",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButtonDisabled: {
    width: 96,
    backgroundColor: "#e5e7eb",
  },
  addButtonTextDisabled: {
    color: "#6b7280",
    fontSize: 12,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    borderRadius: 16,
    paddingHorizontal: 6,
    height: 32,
  },
  
  counterButton: {
    width: 28,
    alignItems: "center",
  },
  
  counterText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000080",
  },
  counterButtonDisabled: {
    opacity: 0.5,
  },
  counterTextDisabled: {
    color: "#6b7280",
  },
  
  counterValue: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000080",
  },
  logo: {
    width: 400,
    height: 90,
    marginTop:35,
  },
  floatingCart: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  
    zIndex: 999,
    elevation: 10,
  },
  
  floatingCartIcon: {
    fontSize: 28,
  },
  
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#000080",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  /* -------------------- CART -------------------- */
  cartContainer: {
    flex: 1,
    backgroundColor: "#f7f8fb",
    padding: 0,
  },
  cartHero: {
    backgroundColor: "#000080",
    padding: 20,
    paddingTop: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  cartHeroBackdrop: {
    position: "absolute",
    right: -40,
    top: 10,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 215, 0, 0.12)",
  },
  cartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  cartBackButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#e8ecfa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cartBackText: {
    fontSize: 18,
    color: "#000080",
    fontWeight: "bold",
  },
  cartTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
  },
  cartSubtitle: {
    color: "#e9edff",
    marginTop: 4,
  },
  cartBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cartBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  cartBadgeText: {
    color: "#8b6d00",
    fontWeight: "700",
    fontSize: 13,
  },
  cartEtaPill: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cartEtaText: {
    color: "#fff",
    fontWeight: "700",
  },
  cartHeroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  cartHeroText: {
    color: "#dbe4ff",
    lineHeight: 20,
  },
  cartList: {
    flexGrow: 0,
  },
  cartListContent: {
    paddingVertical: 4,
    gap: 12,
  },
  cartSectionCard: {
    backgroundColor: "#fff",
    marginTop: -18,
    marginHorizontal: 12,
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cartSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000080",
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1b2340",
    marginBottom: 6,
  },
  cartItemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartItemPrice: {
    color: "#000080",
    fontWeight: "bold",
  },
  cartItemActions: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cartQuantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f5f7ff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cartQuantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
  cartQuantityButtonText: {
    color: "#000080",
    fontWeight: "800",
    fontSize: 18,
  },
  cartQuantityValue: {
    minWidth: 26,
    textAlign: "center",
    fontWeight: "700",
    color: "#000080",
  },
  cartItemTotal: {
    color: "#000080",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartTotalCard: {
    backgroundColor: "#000080",
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    marginHorizontal: 12,
    gap: 8,
  },
  cartTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartTotalLabel: {
    color: "#dbe4ff",
    fontWeight: "600",
  },
  cartTotalValue: {
    color: "#fef3c7",
    fontWeight: "700",
  },
  cartDivider: {
    height: 1,
    backgroundColor: "#1f2d70",
    marginVertical: 6,
  },
  cartInfoPill: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cartInfoPillText: {
    color: "#e9edff",
    fontSize: 13,
  },
  cartGrandTotalLabel: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  cartGrandTotalValue: {
    color: "#FFD700",
    fontWeight: "800",
    fontSize: 18,
  },
  cartFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cartFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartFooterLabel: {
    color: "#374151",
    fontWeight: "600",
  },
  cartFooterValue: {
    color: "#000080",
    fontWeight: "700",
  },
  cartFooterDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  cartFooterTotalLabel: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 16,
  },
  cartFooterTotalValue: {
    color: "#000080",
    fontWeight: "800",
    fontSize: 18,
  },
  cartFooterButton: {
    backgroundColor: "#FFD700",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  cartFooterButtonText: {
    color: "#000080",
    fontWeight: "800",
    fontSize: 16,
  },
  checkoutButton: {
    marginTop: 8,
    backgroundColor: "#FFD700",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
  checkoutButtonText: {
    color: "#000080",
    fontWeight: "800",
    fontSize: 16,
  },
  checkoutButtonTextDisabled: {
    color: "#9ca3af",
  },
  cartEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  cartEmptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cartEmptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000080",
    marginBottom: 6,
  },
  cartEmptyText: {
    color: "#5a6280",
    textAlign: "center",
    marginBottom: 16,
  },
  cartBackButtonAlt: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  cartBackTextAlt: {
    color: "#000080",
    fontWeight: "700",
  },

  /* -------------------- CHECKOUT FLOW -------------------- */
  checkoutScreenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f8fb",
  },
  checkoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  checkoutTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000080",
  },
  checkoutSubtitle: {
    color: "#5a6280",
    marginBottom: 16,
  },
  checkoutCardGroup: {
    gap: 12,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  checkoutCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  checkoutCardSelected: {
    borderColor: "#000080",
    backgroundColor: "#f5f7ff",
  },
  checkoutCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  checkoutCardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkoutCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000080",
  },
  checkoutPill: {
    backgroundColor: "#000080",
    color: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: "700",
    overflow: "hidden",
  },
  checkoutDeleteButton: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  checkoutDeleteText: {
    color: "#b91c1c",
    fontWeight: "700",
  },
  checkoutCardText: {
    color: "#1f2937",
    marginBottom: 2,
  },
  checkoutCardNote: {
    color: "#6b7280",
  },
  inputLabel: {
    color: "#374151",
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  checkoutSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000080",
    marginBottom: 8,
  },
  inlineFields: {
    flexDirection: "row",
    gap: 12,
  },
  inlineFieldItem: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#000080",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonText: {
    color: "#FFD700",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "700",
  },
  ghostButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  ghostButtonText: {
    color: "#4b5563",
    fontWeight: "700",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonTextDisabled: {
    color: "#e5e7eb",
  },
  summarySection: {
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  summaryItemName: {
    flex: 1,
    fontWeight: "600",
    color: "#111827",
  },
  summaryItemQty: {
    color: "#4b5563",
    width: 70,
    textAlign: "right",
  },
  summaryItemPrice: {
    color: "#000080",
    fontWeight: "700",
    width: 100,
    textAlign: "right",
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  legalLinksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 12,
  },
  legalLinksColumn: {
    flex: 1,
    gap: 8,
  },
  legalLink: {
    paddingVertical: 2,
  },
  legalLinkText: {
    fontSize: 12,
    color: "#6b7280",
  },
  legalCaption: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  legalLogosRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legalLogo: {
    height: 24,
    width: 64,
  },
  legalLogoWide: {
    width: 86,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f7f8fb",
    gap: 12,
  },
  successIcon: {
    fontSize: 54,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000080",
  },
  successText: {
    textAlign: "center",
    color: "#4b5563",
    lineHeight: 20,
  },


});
