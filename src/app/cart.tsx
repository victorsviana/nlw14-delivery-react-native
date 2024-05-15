import { View, Text, ScrollView, Alert, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";

import { useNavigation } from "expo-router";

import { ProductCartProps, useCartStore } from "@/stores/cart-store";

import { formatCurrency } from "@/utils/functions/format-currency";

import { Header } from "@/components/header";
import { Product } from "@/components/product";
import Input from "@/components/input";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";

const PHONE_NUMBER = 5511978403849


export default function Cart(){
    const cartStore = useCartStore()
    const [address, setaddress] = useState("")
    const navigation = useNavigation()

    const total = formatCurrency(cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0))

    function handleProductRemove(product: ProductCartProps){
        Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
            {
                text: "Cancelar"
            },
            {
                text: 'Remover',
                onPress: () => cartStore.remove(product.id)
            }
        ])
    }

    function handleOrder() {
        if(address.trim().length === 0) {
            return Alert.alert("Pedido", "Insira os dados da entrega.")
        }

        const products = cartStore.products
            .map((product) => `\n ${product.quantity}x ${product.title}`)
            .join("\n")

        const message = `
        NOVO PEDIDO
        
        \n Entregar em: ${address}${products}
        
        \n Valor Total: ${total}`

        Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)

        cartStore.clear()
        navigation.goBack()
    }

    return (
        <View className="flex-1 pt-8">
            <Header title="Seu carrinho" />
            
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} extraHeight={100}>
                <ScrollView>
                    <View className="flex-1 p-5">
                        {cartStore.products.length > 0 ? (
                            <View className="border-b border-slate-700">
                                {cartStore.products.map((product) => (
                                    <Product key={product.id} data={product} onPress={() => handleProductRemove(product)}/>
                                ))}
                            </View>
                        ) : (
                            <Text className="font-body text-slate-400 text-center my-8">
                                Seu carrinho está vazio.
                            </Text>
                        )}

                        <View className="flex-row gap-2 items-center mt-5 mb-4">
                            <Text className="text-white text-xl font-subtitle">Total: </Text>

                            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
                        </View>
                            <Input 
                                placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
                                onChangeText={setaddress}
                                blurOnSubmit={true}
                                onSubmitEditing={handleOrder}
                                returnKeyType="next"
                            />
                    </View>
                </ScrollView>
            </ KeyboardAwareScrollView>

            <View className="gap-5 p-5">
                <Button onPress={handleOrder}>
                    <Button.Text>Enviar Pedido</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20} />
                    </Button.Icon>
                </Button>

                <LinkButton title="Voltar ao cardápio" href="/"></LinkButton>
            </View>
        </View>
    )
}