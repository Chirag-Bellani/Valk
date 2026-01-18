import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const RouteSelectorModal = ({
  visible,
  onClose,
  routes,
  selectedRouteId,
  onSelect,
}) => {
  const [selected, setSelected] = useState(selectedRouteId || []);

  useEffect(() => {
    if (selectedRouteId) {
      setSelected(selectedRouteId);
    }
  }, [selectedRouteId]);

  const toggleSelection = route => {
    if (selected.includes(route.id)) {
      setSelected(selected.filter(item => item !== route?.id));
    } else {
      setSelected([...selected, route?.id]);
    }
  };

  const handleConfirm = () => {
    // Log the current selected array for debugging

    const filteredSelected = routes.filter(route =>
      selected.includes(route?.id),
    );

    if (filteredSelected.length === 0) {
      setSelected(filteredSelected);
    } else {
    }

    onSelect(filteredSelected);
    onClose();
  };

  const isAllSelected = selected.length === routes.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]); // Deselect all
    } else {
      const allIds = routes.map(route => route?.id);
      setSelected(allIds); // Select all
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Title with "Select All" Checkbox */}
          <View style={styles.titleRow}>
            <Text style={styles.modalTitle}>Select Routes</Text>
            <TouchableOpacity
              style={[
                styles.selectAllButton,
                isAllSelected && styles.selectedRoute,
              ]}
              onPress={toggleSelectAll}>
              <Text style={styles.routeText}>
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={routes}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.routeContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.routeItem,
                  selected.includes(item.id) && styles.selectedRoute,
                ]}
                onPress={() => toggleSelection(item)}>
                <Text style={styles.routeText}>{item?.name}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm Selection</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    height: '80%',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  routeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  routeItem: {
    backgroundColor: '#ffefcc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedRoute: {
    backgroundColor: '#ffc107',
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  confirmButton: {
    width: '40%',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    width: '40%',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
});

export default RouteSelectorModal;
