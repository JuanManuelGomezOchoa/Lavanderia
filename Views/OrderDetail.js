import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const OrderDetail = ({ route }) => {
    // Verificamos si route.params y order existen
    const order = route.params?.order || {};
    
    // Datos por defecto para evitar errores
    const safeOrder = {
        id: order.id || 'N/A',
        client: order.client_name || 'Cliente no disponible',
        status: order.state || 'Estado no disponible',
        created_at: order.created_at || 'Fecha no disponible',
        total: order.total || 0,
        garments: order.garments || [] // Asegurarnos que garments sea un array
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Detalle de Orden #{safeOrder.id}</Text>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información General</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Cliente:</Text>
                        <Text style={styles.infoValue}>{safeOrder.client}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Estado:</Text>
                        <Text style={styles.infoValue}>{safeOrder.status}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Fecha creación:</Text>
                        <Text style={styles.infoValue}>{safeOrder.created_at}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Total:</Text>
                        <Text style={styles.infoValue}>${safeOrder.total}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Prendas</Text>
                    {safeOrder.garments.length > 0 ? (
                        safeOrder.garments.map((garment, index) => (
                            <View key={index} style={styles.garmentCard}>
                                <Text style={styles.garmentType}>{garment.type || 'Tipo no disponible'}</Text>
                                <Text style={styles.garmentDescription}>{garment.description || 'Descripción no disponible'}</Text>
                                <Text style={styles.garmentNotes}>Notas: {garment.observations || 'Ninguna'}</Text>
                                
                                <View style={styles.servicesContainer}>
                                    <Text style={styles.servicesTitle}>Servicios:</Text>
                                    {garment.services && garment.services.length > 0 ? (
                                        garment.services.map((service, sIndex) => (
                                            <View key={sIndex} style={styles.serviceItem}>
                                                <Text style={styles.serviceName}>{service.name || 'Servicio no disponible'}</Text>
                                                <Text style={styles.servicePrice}>${service.price || 0}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.noServices}>No hay servicios registrados</Text>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noGarments}>No hay prendas registradas</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0077b6',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#90e0ef',
        paddingBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#03045e',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#03045e',
    },
    infoValue: {
        color: '#0077b6',
    },
    garmentCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    garmentType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#03045e',
        marginBottom: 5,
    },
    garmentDescription: {
        color: '#495057',
        marginBottom: 5,
    },
    garmentNotes: {
        fontStyle: 'italic',
        color: '#6c757d',
        marginBottom: 10,
    },
    servicesContainer: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#dee2e6',
        paddingTop: 10,
    },
    servicesTitle: {
        fontWeight: 'bold',
        color: '#03045e',
        marginBottom: 5,
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        paddingLeft: 10,
    },
    serviceName: {
        color: '#495057',
    },
    servicePrice: {
        fontWeight: 'bold',
        color: '#0077b6',
    },
    noGarments: {
        textAlign: 'center',
        color: '#6c757d',
        fontStyle: 'italic',
        marginTop: 10,
    },
    noServices: {
        color: '#6c757d',
        fontStyle: 'italic',
        paddingLeft: 10,
    }
});