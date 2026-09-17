"use client";
import React, { useContext, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import CartProductCard from "./CartProductCard";
import QuantityCounter from "./QuantityCounter";
import { MdDelete } from "react-icons/md";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import TotalSingleCartProductPrice from "./TotalSingleCartProductPrice";
import { isUserLoggedIn } from "@/functions/credentials";

type productRow = {
  key: number;
  product: React.JSX.Element;
  price: string;
  quantity: React.JSX.Element;
  total: React.JSX.Element;
  delete: React.JSX.Element;
};

const ProductsTable = () => {
  const { cart, user } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);

  const rows = useMemo(() => {
    if (isUserLoggedIn()) {
      return cart.userCartItems.map((product) => {
        const newProduct: productRow = {
          key: product.id,
          product: (
            <CartProductCard
              id={product.id}
              imageUrl={product.imgSrc}
              title={product.title}
              description={product.description}
            />
          ),
          price: `${product.price}$`,
          quantity: <QuantityCounter product={product} settingLoading={setIsLoading} />,
          total: (
            <TotalSingleCartProductPrice
              totalPrice={product.price * product.quantity}
            />
          ),
          delete: (
            <MdDelete
              className="text-red-500 transition-all hover:text-red-700 text-3xl cursor-pointer"
              onClick={() => {
                user.setIsMergingOrRemovingLoading = true;
                user.removeProductFromUserCart(product.cartItemId).then(() => {
                  cart.setProductsCount = cart.productsCount - 1;
                  user.setIsMergingOrRemovingLoading = false;
                });
              }}
            />
          ),
        };
        return newProduct;
      });
    } else {
      return cart.cartProducts.map((product) => {
        const newProduct: productRow = {
          key: product.id,
          product: (
            <CartProductCard
              id={product.id}
              imageUrl={product.imgSrc}
              title={product.title}
              description={product.description}
            />
          ),
          price: `${product.price}$`,
          quantity: <QuantityCounter product={product} settingLoading={setIsLoading} />,
          total: (
            <TotalSingleCartProductPrice
              totalPrice={product.price * product.quantity}
            />
          ),
          delete: (
            <MdDelete
              className="text-red-500 transition-all hover:text-red-700 text-3xl cursor-pointer"
              onClick={() => {
                cart.deleteProduct(product.id);
              }}
            />
          ),
        };
        return newProduct;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.productsCount, cart.cartProducts, cart.userCartItems]);

  const columns = [
    {
      key: "product",
      label: "Product",
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "total",
      label: "Total",
    },
    {
      key: "delete",
      label: "",
    },
  ];

  return (
    <Table
      aria-label="Example table with dynamic content"
      layout="auto"
      radius="none"
      shadow="none"
      classNames={{
        th: "bg-mainPink text-mainWhite",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className={`font-bold text-lg ${
              column.key !== "product" ? "text-center" : "pl-12"
            }`}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow
            key={item.key}
            className="border-b-1 border-mainBlack/10 border-solid relative"
          >
            {(columnKey) => (
              <TableCell
                className={`text-xl  ${
                  columnKey !== "product" ? "text-center" : ""
                }`}
              >
                {getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default observer(ProductsTable);
