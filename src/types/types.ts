export type DrawerParamList = {
  Home: undefined;
  Settings: undefined;
  
};
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  isPopular: boolean;
  discountPercentage: number;
}