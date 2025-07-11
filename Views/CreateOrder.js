import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export const CreateOrder = () => {
  const services = [
    { name: 'Lavado', quantity: 0, unitPrice: 22, description: 'Lavado estandar' },
    { name: 'Planchado', quantity: 0, unitPrice: 60, description: 'Planchado profesional' },
    { name: 'Tintoreria', quantity: 0, unitPrice: 0, description: 'Servicio de tintoreria' },
    { name: 'Especial', quantity: 0, unitPrice: 0, description: 'Servicio especial' },
  ];

  const garments = [
    'Camisa', 'Pantalon', 'Prenda Interior', 'Blusa', 'Vestido',
    'Chamarra', 'Traje', 'Sueter', 'Falda', 'Saco', 'Playera'
  ];

  const [order, setOrder] = useState({
    client_id: 1,
    user_id: 1,
    estimated_delivery_date: new Date().toISOString().split('T')[0],
    state: 'recibido',
    total_price: 0,
    pagado: false,
    garments: [{
      type: 'Camisa',
      description: '',
      notes: '',
      services: [{ ...services[0] }],
    }],
  });

  useEffect(() => {
    let total = 0;
    order.garments.forEach(garment => {
      garment.services.forEach(service => {
        total += service.quantity * service.unitPrice;
      });
    });
    setOrder(prev => ({ ...prev, total_price: total }));
  }, [order.garments]);

  const addGarment = () => {
    setOrder(prev => ({
      ...prev,
      garments: [...prev.garments, {
        type: 'Camisa',
        description: '',
        notes: '',
        services: [{ ...services[0] }],
      }],
    }));
  };

  const deleteGarment = (index) => {
    const newGarments = order.garments.filter((_, i) => i !== index);
    setOrder(prev => ({ ...prev, garments: newGarments }));
  };

  const addServiceToGarment = (garmentIndex) => {
    const updatedGarments = [...order.garments];
    updatedGarments[garmentIndex].services.push({ ...services[0] });
    setOrder(prev => ({ ...prev, garments: updatedGarments }));
  };

  const deleteServiceFromGarment = (garmentIndex, serviceIndex) => {
    const updatedGarments = [...order.garments];
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
          quantity: updatedGarments[garmentIndex].services[serviceIndex].quantity
        };
      }
    } else {
      updatedGarments[garmentIndex].services[serviceIndex][key] = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    }
    setOrder(prev => ({ ...prev, garments: updatedGarments }));
  };

  const submitOrder = async () => {
    try {
      // Preparamos el payload para que coincida con el backend
      const payload = {
        client_id: order.client_id,
        user_id: order.user_id,
        estimated_delivery_date: order.estimated_delivery_date,
        state: order.state,
        total: order.total_price,  // Cambiado de total_price a total
        pagado: order.pagado,
        garments: order.garments.map(garment => ({
          type: garment.type,
          description: garment.description,
          observations: garment.notes,  // Cambiado de notes a observations
          services: garment.services.map(service => ({
            name: service.name,
            unitPrice: service.unitPrice,
            quantity: service.quantity
          }))
        }))
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
        // Opcional: Resetear el formulario después de éxito
        setOrder({
          client_id: 1,
          user_id: 1,
          estimated_delivery_date: new Date().toISOString().split('T')[0],
          state: 'recibido',
          total_price: 0,
          pagado: false,
          garments: [{
            type: 'Camisa',
            description: '',
            notes: '',
            services: [{ ...services[0] }],
          }],
        });
      } else {
        Alert.alert('Error', result.msg || 'Error al crear la orden');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Orden</Text>

      <TouchableOpacity onPress={addGarment} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Agregar Prenda</Text>
      </TouchableOpacity>

      {order.garments.map((garment, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.subtitle}>Prenda #{i + 1}</Text>
            {i > 0 && (
              <TouchableOpacity onPress={() => deleteGarment(i)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>✕ Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Tipo de prenda:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={garment.type}
              onValueChange={(value) => onChangeGarmentField('type', value, i)}
              style={styles.picker}
            >
              {garments.map((g, index) => (
                <Picker.Item key={index} label={g} value={g} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={garment.description}
            onChangeText={(text) => onChangeGarmentField('description', text, i)}
            placeholder="Ej: Camisa blanca de algodón"
          />

          <Text style={styles.label}>Notas:</Text>
          <TextInput
            style={styles.input}
            value={garment.notes}
            onChangeText={(text) => onChangeGarmentField('notes', text, i)}
            placeholder="Ej: Mancha en la manga derecha"
          />

          <Text style={[styles.subtitle, {marginTop: 10}]}>Servicios:</Text>

          {garment.services.map((service, is) => (
            <View key={is} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>Servicio {is + 1}</Text>
                {is > 0 && (
                  <TouchableOpacity onPress={() => deleteServiceFromGarment(i, is)}>
                    <Text style={styles.deleteButtonText}>✕ Eliminar</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Tipo de servicio:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={service.name}
                  onValueChange={(value) => onChangeServiceField('name', value, i, is)}
                  style={styles.picker}
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
                value={String(service.quantity)}
                onChangeText={(text) => onChangeServiceField('quantity', text, i, is)}
              />

              <Text style={styles.label}>Precio unitario:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(service.unitPrice)}
                onChangeText={(text) => onChangeServiceField('unitPrice', text, i, is)}
              />
            </View>
          ))}

          <TouchableOpacity 
            onPress={() => addServiceToGarment(i)} 
            style={styles.addServiceButton}
          >
            <Text style={styles.addServiceButtonText}>+ Agregar Servicio</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${order.total_price.toFixed(2)}</Text>
      </View>

      <TouchableOpacity onPress={submitOrder} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Guardar Orden</Text>
      </TouchableOpacity>

{/*Resumen de la orden */}
      <View style={styles.ticketContainer}>
        <Text style={styles.ticketTitle}>RESUMEN DE ORDEN</Text>
        
        {order.garments.map((garment, index) => (
          <View key={`garment-${index}`} style={styles.ticketGarment}>
            <Text style={styles.ticketGarmentTitle}>
              Tipo de prenda: {index} {garment.type}
            </Text>
            
            <View style={styles.ticketServices}>
              {garment.services.map((service, sIndex) => (
                <View key={`service-${sIndex}`} style={styles.ticketServiceRow}>
                  <Text style={styles.ticketServiceName}>
                     {service.name}
                  </Text>
                  <Text style={styles.ticketServiceDetails}>
                    ${service.unitPrice} x {service.quantity} = ${(service.unitPrice * service.quantity).toFixed(2)} {/*El toFixed es para los decimales*/}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.ticketTotal}>
          <Text style={styles.ticketTotalLabel}>TOTAL:</Text>
          <Text style={styles.ticketTotalAmount}>${order.total_price.toFixed(2)}</Text>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  serviceCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontWeight: '500',
    color: '#555',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#fff',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addServiceButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
  },
  addServiceButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  submitButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ticketContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  ticketGarment: {
    marginBottom: 12,
  },
  ticketGarmentTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  ticketServices: {
    marginLeft: 8,
  },
  ticketServiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ticketServiceName: {
    color: '#666',
    flex: 2,
  },
  ticketServiceDetails: {
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  ticketTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  ticketTotalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ticketTotalAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
  },
});