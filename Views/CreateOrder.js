import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export const CreateOrder = () => {
  const [services, setServices] = useState([]);
  const [garments, setGarments] = useState([]);
  const [order, setOrder] = useState({
    client_id: 1,
    user_id: 1,
    estimated_delivery_date: new Date().toISOString().split('T')[0],
    state: 'recibido',
    total_price: 0,
    pagado: false,
    garments: [],
  });

  useEffect(() => {
    // Cargar servicios y prendas desde API
    fetch('https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/services')
      .then(res => res.json())
      .then(data => {
        if (data.services) {
          // Aseguramos que quantity y unitPrice inicien en 0
          const servicesWithQty = data.services.map(s => ({ 
            ...s, 
            quantity: 0,
            unitPrice: s.unitPrice || 0 
          }));
          setServices(servicesWithQty);
        }
      })
      .catch(() => Alert.alert('Error', 'No se pudieron cargar los servicios'));

    fetch('https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/garments')
      .then(res => res.json())
      .then(data => {
        if (data.garments) {
          setGarments(data.garments);
        }
      })
      .catch(() => Alert.alert('Error', 'No se pudieron cargar las prendas'));
  }, []);

  useEffect(() => {
    // Cuando ya tenemos prendas y servicios, inicializar order.garments si está vacío
    if (services.length > 0 && garments.length > 0 && order.garments.length === 0) {
      setOrder(prev => ({
        ...prev,
        garments: [{
          type: garments[0].type || garments[0].name || 'Sin tipo',
          description: '',
          notes: '',
          services: [{ 
            ...services[0],
            quantity: 0,
            unitPrice: services[0].unitPrice || 0 
          }],
        }],
      }));
    }
  }, [services, garments]);

  useEffect(() => {
    calculateTotal();
  }, [order.garments]);

  const calculateTotal = () => {
    let total = 0;
    order.garments.forEach(garment => {
      garment.services.forEach(service => {
        const quantity = Number(service.quantity) || 0;
        const unitPrice = Number(service.unitPrice) || 0;
        total += quantity * unitPrice;
      });
    });
    setOrder(prev => ({ ...prev, total_price: total }));
  };

  const addGarment = () => {
    setOrder(prev => ({
      ...prev,
      garments: [...prev.garments, {
        type: garments[0]?.type || garments[0]?.name || 'Sin tipo',
        description: '',
        notes: '',
        services: [{ 
          ...services[0], 
          quantity: 0,
          unitPrice: services[0].unitPrice || 0 
        }],
      }],
    }));
  };

  const deleteGarment = (index) => {
    if (order.garments.length <= 1) {
      Alert.alert('Error', 'Debe haber al menos una prenda');
      return;
    }
    const newGarments = order.garments.filter((_, i) => i !== index);
    setOrder(prev => ({ ...prev, garments: newGarments }));
  };

  const addServiceToGarment = (garmentIndex) => {
    const updatedGarments = [...order.garments];
    updatedGarments[garmentIndex].services.push({ 
      ...services[0], 
      quantity: 0,
      unitPrice: services[0].unitPrice || 0 
    });
    setOrder(prev => ({ ...prev, garments: updatedGarments }));
  };

  const deleteServiceFromGarment = (garmentIndex, serviceIndex) => {
    const updatedGarments = [...order.garments];
    if (updatedGarments[garmentIndex].services.length <= 1) {
      Alert.alert('Error', 'Cada prenda debe tener al menos un servicio');
      return;
    }
    updatedGarments[garmentIndex].services = updatedGarments[garmentIndex].services.filter((_, i) => i !== serviceIndex);
    setOrder(prev => ({ ...prev, garments: updatedGarments }));
  };

  const onChangeGarmentField = (key, value, index) => {
    const updatedGarments = [...order.garments];
    updatedGarments[index][key] = value;
    setOrder(prev => ({ ...prev, garments: updatedGarments }));
  };

  const onChangeServiceField = (key, value, garmentIndex, serviceIndex) => {
    const updatedGarments = [...order.garments];
    if (key === 'name') {
      const newService = services.find(s => s.name === value);
      if (newService) {
        updatedGarments[garmentIndex].services[serviceIndex] = {
          ...newService,
          quantity: updatedGarments[garmentIndex].services[serviceIndex].quantity || 0,
          unitPrice: newService.unitPrice || 0
        };
      }
    } else {
      const numericValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
      updatedGarments[garmentIndex].services[serviceIndex][key] = numericValue;
    }
    setOrder(prev => ({ ...prev, garments: updatedGarments }));
    calculateTotal();
  };

  const submitOrder = async () => {
    try {
      const payload = {
        client_id: order.client_id,
        user_id: order.user_id,
        estimated_delivery_date: order.estimated_delivery_date,
        state: order.state,
        total: order.total_price,
        pagado: order.pagado,
        garments: order.garments.map(garment => ({
          type: garment.type,
          description: garment.description,
          observations: garment.notes,
          services: garment.services.map(service => ({
            name: service.name,
            unitPrice: service.unitPrice || 0,
            quantity: service.quantity || 0,
          })),
        })),
      };

      const response = await fetch('https://5f1dkwj7-5000.usw3.devtunnels.ms/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', `Orden creada con ID: ${result.order_id}`);
        resetForm();
      } else {
        Alert.alert('Error', result.msg || 'Error al crear la orden');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  const resetForm = () => {
    setOrder({
      client_id: 1,
      user_id: 1,
      estimated_delivery_date: new Date().toISOString().split('T')[0],
      state: 'recibido',
      total_price: 0,
      pagado: false,
      garments: [{
        type: garments[0]?.type || garments[0]?.name || 'Sin tipo',
        description: '',
        notes: '',
        services: [{ 
          ...services[0], 
          quantity: 0,
          unitPrice: services[0].unitPrice || 0 
        }],
      }],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Orden</Text>

      <TouchableOpacity onPress={addGarment} style={styles.addButton}>
        <Text style={styles.buttonText}>+ Agregar Prenda</Text>
      </TouchableOpacity>

      {order.garments.map((garment, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Prenda #{i + 1}</Text>
            <TouchableOpacity
              onPress={() => deleteGarment(i)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Tipo de prenda:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={garment.type}
              onValueChange={(value) => onChangeGarmentField('type', value, i)}
            >
              {garments.map((g, index) => (
                <Picker.Item
                  key={index}
                  label={g.type || g.name || 'Sin tipo'}
                  value={g.type || g.name || 'Sin tipo'}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={garment.description}
            onChangeText={(text) => onChangeGarmentField('description', text, i)}
            placeholder="Descripción de la prenda"
          />

          <Text style={styles.label}>Notas:</Text>
          <TextInput
            style={styles.input}
            value={garment.notes}
            onChangeText={(text) => onChangeGarmentField('notes', text, i)}
            placeholder="Notas adicionales"
            multiline
          />

          <Text style={styles.sectionTitle}>Servicios:</Text>

          {garment.services.map((service, is) => (
            <View key={is} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>Servicio {is + 1}</Text>
                <TouchableOpacity
                  onPress={() => deleteServiceFromGarment(i, is)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Tipo de servicio:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={service.name}
                  onValueChange={(value) => onChangeServiceField('name', value, i, is)}
                >
                  {services.map((s, idx) => (
                    <Picker.Item key={idx} label={s.name} value={s.name} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Cantidad:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(service.quantity || 0)}
                onChangeText={(text) => onChangeServiceField('quantity', text, i, is)}
              />

              <Text style={styles.label}>Precio unitario:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(service.unitPrice || 0)}
                onChangeText={(text) => onChangeServiceField('unitPrice', text, i, is)}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={() => addServiceToGarment(i)}
            style={styles.addServiceButton}
          >
            <Text style={styles.buttonText}>+ Agregar Servicio</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${order.total_price.toFixed(2)}</Text>
      </View>

      <TouchableOpacity onPress={submitOrder} style={styles.submitButton}>
        <Text style={styles.buttonText}>Guardar Orden</Text>
      </TouchableOpacity>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>RESUMEN DE ORDEN</Text>

        {order.garments.map((garment, index) => (
          <View key={`summary-${index}`} style={styles.garmentSummary}>
            <Text style={styles.garmentTitle}>
              Prenda {index + 1}: {garment.type}
            </Text>

            <View style={styles.servicesSummary}>
              {garment.services.map((service, sIndex) => (
                <View key={`service-${sIndex}`} style={styles.serviceRow}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>
                    ${service.unitPrice || 0} x {service.quantity || 0} = $
                    {((service.unitPrice || 0) * (service.quantity || 0)).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.finalTotal}>
          <Text style={styles.finalTotalLabel}>TOTAL:</Text>
          <Text style={styles.finalTotalAmount}>${order.total_price.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#caf0f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03045e',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#90e0ef',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03045e',
  },
  label: {
    fontSize: 14,
    color: '#0077b6',
    marginBottom: 6,
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#00b4d8',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    color: '#03045e',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#00b4d8',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03045e',
    marginTop: 12,
    marginBottom: 8,
  },
  serviceCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#90e0ef',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077b6',
  },
  deleteButton: {
    padding: 6,
  },
  deleteButtonText: {
    color: '#c1121f',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#0077b6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  addServiceButton: {
    backgroundColor: '#00b4d8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#90e0ef',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03045e',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077b6',
  },
  submitButton: {
    backgroundColor: '#0077b6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#90e0ef',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03045e',
    textAlign: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#90e0ef',
    paddingBottom: 8,
  },
  garmentSummary: {
    marginBottom: 12,
  },
  garmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077b6',
    marginBottom: 8,
  },
  servicesSummary: {
    marginLeft: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  serviceName: {
    color: '#03045e',
    fontSize: 14,
  },
  servicePrice: {
    color: '#03045e',
    fontSize: 14,
    fontWeight: '500',
  },
  finalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#90e0ef',
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03045e',
  },
  finalTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077b6',
  },
});