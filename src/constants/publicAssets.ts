import accessoriesImg from "../assets/images/accessories.jpg";
import bikeImg from "../assets/images/bike.jpg";
import carImg from "../assets/images/car.jpg";
import clockImg from "../assets/images/clock.jpg";
import clothingImg from "../assets/images/clothing.jpg";
import devicesImg from "../assets/images/devices.jpg";
import electronicsImg from "../assets/images/electronics.jpg";
import phoneImg from "../assets/images/phone.jpg";
import controller from "../assets/images/controller.jpg";

export interface PublicAsset {
  id: string;
  name: string;
  url: string;
}

export const PUBLIC_PRODUCT_ASSETS: PublicAsset[] = [
  { id: "devices", name: "Devices", url: devicesImg },
  { id: "electronics", name: "Electronics", url: electronicsImg },
  { id: "accessories", name: "Accessories", url: accessoriesImg },
  { id: "clothing", name: "Clothing", url: clothingImg },
  { id: "clock", name: "Clock", url: clockImg },
  { id: "car", name: "Car", url: carImg },
  { id: "bike", name: "Bike", url: bikeImg },
  { id: "phone", name: "Phone", url: phoneImg },
  { id: "controller", name: "Controller", url: controller },
];