import tomatoesImg from "../../assets/tomato.png";
import lettuceImg from "../../assets/lettucehead.png";
import carrotsImg from "../../assets/carrots.png";
import cornImg from "../../assets/corn.png" ;
import bellpeppersImg from "../../assets/bellpeppers.png";
import broccoliImg from "../../assets/broccoli.png";
import cucumberImg from "../../assets/cucumber.png";
import spinachImg from "../../assets/spinach.png";

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
}

export const products: ProductItem[] = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: 4.99,
    description: "Ripe, juicy tomatoes perfect for salads and cooking",
    image: tomatoesImg,
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 2,
    name: "Green Lettuce",
    price: 3.49,
    description: "Crisp, fresh lettuce ideal for salads and wraps",
    image: lettuceImg,
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 3,
    name: "Organic Carrots",
    price: 5.99,
    description: "Sweet organic carrots, great raw or cooked",
    image: carrotsImg,
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 4,
    name: "Bell Peppers Mix",
    price: 6.99,
    description: "Colorful peppers packed with vitamins and flavor",
    image: bellpeppersImg,
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 5,
    name: "Broccoli Crown",
    price: 4.49,
    description: "Nutrient-rich green florets, steamy or roasted",
    image: broccoliImg,
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 6,
    name: "Cucumber Fresh",
    price: 2.99,
    description: "Cool, refreshing cucumbers for salads and snacking",
    image: cucumberImg,
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 7,
    name: "Onions White",
    price: 3.29,
    description: "Versatile onions for cooking and fresh use",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 8,
    name: "Spinach Organic",
    price: 4.99,
    description: "Leafy organic spinach loaded with iron and nutrients",
    image: spinachImg,
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 9,
    name: "Cabbage Fresh",
    price: 3.99,
    description: "Tender cabbage great for coleslaw and cooking",
    image:
      "https://images.unsplash.com/photo-1615485925763-86786288908b?auto=format&fit=crop&w=900&q=80",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 10,
    name: "Garlic Bulbs",
    price: 5.49,
    description: "Pungent, aromatic garlic to elevate any dish",
    image:
      "https://images.unsplash.com/photo-1615477550927-cae279fdc1ba?auto=format&fit=crop&w=900&q=80",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 11,
    name: "Mushrooms Fresh",
    price: 7.99,
    description: "Earthy, flavorful mushrooms for sauteing and more",
    image:
      "https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=900&q=80",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 12,
    name: "Zucchini Fresh",
    price: 4.29,
    description: "Tender zucchini perfect for grilling or baking",
    image:
      "https://images.unsplash.com/photo-1603048719539-9ecb4e5ec1d4?auto=format&fit=crop&w=900&q=80",
    category: "Vegetables",
    inStock: true,
  },
];
