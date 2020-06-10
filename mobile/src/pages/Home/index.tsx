import React, { useEffect, useState } from 'react'
import { Feather as Icon, Feather } from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { lavenderblush } from 'color-name';

interface IBGEUF {
	sigla: string;
	nome: string;
}

interface IBGECity {
	nome: string;
}

const Home = () => {
	const navigation = useNavigation();

	const [ufs, setUfs] = useState<IBGEUF[]>([]);
	const [selectedUf, setSelectedUf] = useState('0');
	const [cities, setCities] = useState<IBGECity[]>([]);
	const [selectedCity, setSelectedCity] = useState();

	useEffect(()=>{
		axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
			setCities(response.data);
		})
	}, [selectedUf]);

	useEffect(()=>{
		axios.get<IBGEUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
			setUfs(response.data.sort((a, b) => a.nome.localeCompare(b.nome)));
		});
	}, []);

	function handleNavigationToPoints() {
		navigation.navigate('Points', {
			selectedUf,
			selectedCity
		});
	}

	function handleSelectedUfChange(value: string) {
		setSelectedUf(value);
	}

	return (
		<ImageBackground
			source={require('../../assets/home-background.png')}
			style={styles.container}
			imageStyle={{ width: 274, height: 368 }}
		>
			<View style={styles.main}>
				<Image source={require('../../assets/logo.png')}/>
				<Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
				<Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
			</View>

			<View style={styles.input}>
				<RNPickerSelect
					style={styles}
					Icon={() => {return <Feather name='chevron-down' color='#34CB79' size={24} />}}
					onValueChange={(value) => handleSelectedUfChange(value)}
					items={[] = ufs.map(uf => ({label: `${uf.nome} - ${uf.sigla}`, value: uf.sigla}))}
					placeholder = {{
						label: 'Selecione um estado...',
						value: null,
						color: '#9EA0A4',
					}}
					useNativeAndroidPickerStyle={false}
				/>
			</View>

			<View style={styles.input}>
				<RNPickerSelect
					style={styles}
					Icon={() => {return <Feather name='chevron-down' color='#34CB79' size={24} />}}
					onValueChange={(value)=>setSelectedCity(value)}
					items={[] = cities.map(city => ({label: city.nome, value: city.nome}))}
					placeholder = {{
						label: 'Selecione uma cidade...',
						value: null,
						color: '#9EA0A4',
					}}
					useNativeAndroidPickerStyle={false}
				/>
			</View>

			<View style={styles.footer}>
				<RectButton style={styles.button} onPress={handleNavigationToPoints}>
					<View style={styles.buttonIcon}>
						<Text>
							<Icon name="arrow-right" color="#FFF" size={24}/>
						</Text>
					</View>
					<Text style={styles.buttonText}>Entrar</Text>
				</RectButton>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 32,
	},

	main: {
		flex: 1,
		justifyContent: 'center',
	},

	title: {
		color: '#322153',
		fontSize: 32,
		fontFamily: 'Ubuntu_700Bold',
		maxWidth: 260,
		marginTop: 64,
	},

	description: {
		color: '#6C6C80',
		fontSize: 16,
		marginTop: 16,
		fontFamily: 'Roboto_400Regular',
		maxWidth: 260,
		lineHeight: 24,
	},

	footer: {},

	select: {},

	input: {
		height: 60,
		backgroundColor: '#FFF',
		borderRadius: 10,
		marginBottom: 8,
		paddingVertical: 10,
		paddingHorizontal: 18,
		fontSize: 16,
		justifyContent: 'center',
	},
	
	button: {
		backgroundColor: '#34CB79',
		height: 60,
		flexDirection: 'row',
		borderRadius: 10,
		overflow: 'hidden',
		alignItems: 'center',
		marginTop: 8,
	},
	
	buttonIcon: {
		height: 60,
		width: 60,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	
	buttonText: {
		flex: 1,
		justifyContent: 'center',
		textAlign: 'center',
		color: '#FFF',
		fontFamily: 'Roboto_500Medium',
		fontSize: 16,
	},
	
	inputIOS: {
		fontSize: 16,
		paddingVertical: 12,
		paddingHorizontal: 10,
		paddingRight: 30, // to ensure the text is never behind the icon
	},
	
	inputAndroid: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		paddingRight: 30, // to ensure the text is never behind the icon
	},

	iconContainer: {
		top:8
	}
});

export default Home;