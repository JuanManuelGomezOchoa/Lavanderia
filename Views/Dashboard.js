import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export const Dashboard = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [counting, setCounting] = useState({
        quantity_garments: 0,
        quantity_services: 0,
        quantity_clients: 0,
        quantity_users: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPendingPage, setCurrentPendingPage] = useState(1);

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([getOrders(), getPendingOrders(), getCounting()]);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };
        loadData();
    }, [currentPage, currentPendingPage]);

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/get-orders-dashboard?pagination=${currentPage}`);
            setOrders(data);
        } catch (error) {
            console.error("Error getting orders:", error);
        }
    };

    const getPendingOrders = async () => {
        try {
            const { data } = await axios.get(`https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/get-pending-orders-dashboard?pagination=${currentPendingPage}`);
            setPendingOrders(data);
        } catch (error) {
            console.error("Error getting pending orders:", error);
        }
    };

    const getCounting = async () => {
        try {
            const { data } = await axios.get("https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/get-counting");
            setCounting(data);
        } catch (error) {
            console.error("Error getting counting:", error);
        }
    };

    const renderPagination = (currentPage, setPage, totalPages = 3) => {
        return (
            <View style={styles.paginationContainer}>
                {[...Array(totalPages)].map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.pageButton,
                            currentPage === index + 1 && styles.activePageButton
                        ]}
                        onPress={() => setPage(index + 1)}
                    >
                        <Text style={[
                            styles.pageButtonText,
                            currentPage === index + 1 && styles.activePageButtonText
                        ]}>
                            {index + 1}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderTable = (items, title, currentPage, setPage) => {
        return (
            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>{title}</Text>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.columnId]}>ID</Text>
                    <Text style={[styles.tableHeaderText, styles.columnName]}>Cliente</Text>
                    <Text style={[styles.tableHeaderText, styles.columnStatus]}>Estado</Text>
                    <Text style={[styles.tableHeaderText, styles.columnAction]}>Detalle</Text>
                </View>
                {items && items.length > 0 ? (
                    items.map((item) => (
                        <View key={item.id} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.columnId]}>{item.id}</Text>
                            <Text style={[styles.tableCell, styles.columnName]}>{item.client_name}</Text>
                            <Text style={[styles.tableCell, styles.columnStatus]}>{item.state}</Text>
                            <TouchableOpacity 
                                style={[styles.tableCell, styles.columnAction, styles.detailButton]}
                                onPress={() => navigation.navigate("orderDetail", { order: item })}
                            >
                                <Text style={styles.detailButtonText}>Ver</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noData}>No hay datos disponibles</Text>
                )}
                {renderPagination(currentPage, setPage)}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Lavandería</Text>
                
                <View style={styles.innerCard}>
                    <Text style={styles.subtitle}>Conteo por unidad</Text>
                    <View style={styles.countContainer}>
                        <TouchableOpacity 
                            style={styles.countItem}
                            onPress={() => navigation.navigate("seeingGarments")}
                        >
                            <Text style={styles.countLabel}>Número Prendas</Text>
                            <Text style={styles.countNumber}>{counting.quantity_garments}</Text>
                            <Text style={styles.viewText}>Ver prendas</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.countItem}
                            onPress={() => navigation.navigate("seeingServices")}
                        >
                            <Text style={styles.countLabel}>Número de Servicios</Text>
                            <Text style={styles.countNumber}>{counting.quantity_services}</Text>
                            <Text style={styles.viewText}>Ver servicios</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.countItem}
                            onPress={() => navigation.navigate("clientCrud")}
                        >
                            <Text style={styles.countLabel}>Número de Clientes</Text>
                            <Text style={styles.countNumber}>{counting.quantity_clients}</Text>
                            <Text style={styles.viewText}>Ver clientes</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.countItem}
                            onPress={() => navigation.navigate("userCrud")}
                        >
                            <Text style={styles.countLabel}>Número de Usuarios</Text>
                            <Text style={styles.countNumber}>{counting.quantity_users}</Text>
                            <Text style={styles.viewText}>Ver usuarios</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate("createOrder")}
                    >
                        <Text style={styles.buttonText}>Crear Orden</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.tablesWrapper}>
                    {renderTable(orders, "Listado de órdenes", currentPage, setCurrentPage)}
                    {renderTable(pendingOrders, "Órdenes Pendientes", currentPendingPage, setCurrentPendingPage)}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#caf0f8',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#03045e',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#03045e',
    },
    innerCard: {
        backgroundColor: '#f0f8ff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#90e0ef',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#0077b6',
    },
    countContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    countItem: {
        alignItems: 'center',
        padding: 12,
        width: '48%',
        marginBottom: 10,
        backgroundColor: '#90e0ef',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00b4d8',
    },
    countLabel: {
        fontSize: 14,
        color: '#03045e',
    },
    countNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#0077b6',
    },
    viewText: {
        fontSize: 12,
        color: '#0077b6',
        marginTop: 5,
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        alignItems: 'flex-end',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#0077b6',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    tablesWrapper: {
        marginTop: 10,
    },
    tableContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#90e0ef',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
    },
    tableTitle: {
        backgroundColor: '#00b4d8',
        padding: 12,
        fontWeight: 'bold',
        color: '#ffffff',
        fontSize: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#90e0ef',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#00b4d8',
    },
    tableHeaderText: {
        fontWeight: 'bold',
        color: '#03045e',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#90e0ef',
    },
    tableCell: {
        paddingHorizontal: 5,
        color: '#03045e',
    },
    columnId: {
        width: '15%',
    },
    columnName: {
        width: '40%',
    },
    columnStatus: {
        width: '25%',
    },
    columnAction: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailButton: {
        backgroundColor: '#0077b6',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    detailButtonText: {
        color: 'white',
        fontSize: 14,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#f8f9fa',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    pageButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    activePageButton: {
        backgroundColor: '#0077b6',
    },
    pageButtonText: {
        color: '#495057',
        fontWeight: 'bold',
    },
    activePageButtonText: {
        color: '#ffffff',
    },
    noData: {
        textAlign: 'center',
        padding: 15,
        color: '#0077b6',
    },
});