import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AadhaarPANVerification = ({ navigation, route }) => {
  const [completedSteps, setCompletedSteps] = useState([false, false]);
  const [currentStep, setCurrentStep] = useState(0);


  useEffect(() => {
    if (route.params?.step1Completed) {

      const updatedSteps = [...completedSteps];
      updatedSteps[0] = true;
      setCompletedSteps(updatedSteps);
      saveCompletionStatus(updatedSteps);
      if (!updatedSteps[1]) {
        setCurrentStep(1);
      }
    }

    if (route.params?.step2Completed) {
      const updatedSteps = [...completedSteps];
      updatedSteps[1] = true;
      setCompletedSteps(updatedSteps);
      saveCompletionStatus(updatedSteps);
      setCurrentStep(2); // Move to the next step
    }
  }, [route.params?.step1Completed, route.params?.step2Completed]);

  // Save completion status to AsyncStorage
  const saveCompletionStatus = async steps => {
    try {
      await AsyncStorage.setItem('completedSteps', JSON.stringify(steps));
    } catch (error) {
      console.error('Failed to save completion status:', error);
    }
  };
  useEffect(() => {
    // This ensures the component starts at the correct step
    if (completedSteps[1]) {
      setCurrentStep(1);
    } else if (completedSteps[0]) {
      setCurrentStep(1); // Fix to ensure it doesn't move to step 1 incorrectly
    }
  }, [completedSteps]);

  const steps = [
    {
      name: 'Verify Aadhaar',
      status: completedSteps[0] ? 'Verified' : 'Not Verified',
    },
    {
      name: 'Verify PAN',
      status: completedSteps[1] ? 'Verified' : 'Not Verified',
    },
  ];

  const handleContinue = () => {
    if (currentStep === 0) {
      navigation.navigate('Aadhaar Upload');
    } else if (currentStep === 1) {
      navigation.navigate('PAN Upload');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.backBtn}>
          <AntDesign name="arrowleft" color="black" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Aadhaar & PAN Verification</Text>
        <TouchableOpacity onPress={() => { }} style={styles.helpBtn}>
          <AntDesign name="questioncircleo" color="black" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepIndicator}>
              <View
                style={styles.stepCircle(
                  index === currentStep,
                  completedSteps[index],
                )}>
                {completedSteps[index] && (
                  <AntDesign name="check" size={20} color="white" />
                )}
              </View>
              {index < steps.length - 1 && <View style={styles.stepLine} />}
            </View>
            <View style={styles.stepLabelContainer}>
              <View style={styles.stepHeader}>
                <Text
                  style={[
                    styles.stepHeaderLabel,
                    completedSteps[index] || index === currentStep
                      ? styles.activeStep
                      : styles.inactiveStep,
                  ]}>
                  Step {index + 1}
                </Text>
                <Text
                  style={[
                    styles.stepStatus,
                    completedSteps[index]
                      ? styles.activeStatus
                      : index === currentStep
                        ? styles.activeStatus
                        : styles.inactiveStatus,
                  ]}>
                  {step.status}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  completedSteps[index] || index === currentStep
                    ? styles.activeLabel
                    : styles.inactiveLabel,
                ]}>
                {step.name}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>Note :</Text>
        <Text style={styles.notes}>
          ● PAN and Aadhaar should be of the same person
        </Text>
        <Text style={styles.notes}>
          ● Use personal PAN only and not business PAN
        </Text>
        <Text style={styles.notes}>
          ● Verification will be completed within 48Hrs
        </Text>
      </View>

      <View style={styles.fixedBottom}>
        <TouchableOpacity
          style={[
            styles.continueBtn,
            completedSteps[0] && completedSteps[1] ? styles.disabledBtn : {},
          ]}
          onPress={handleContinue}
          disabled={completedSteps[0] && completedSteps[1]}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backBtn: {
    marginTop: 7,
  },
  helpBtn: {
    marginTop: 7,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  stepsContainer: {
    paddingHorizontal: 15,
    marginTop: 30,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 10,
  },
  stepCircle: (isActive, isCompleted) => ({
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor:
      isActive && !isCompleted ? 'orange' : isCompleted ? '#4CAF50' : '#dedede',
    backgroundColor: isCompleted ? '#4CAF50' : '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  stepLine: {
    width: 2,
    height: 160,
    marginTop: 1,
    backgroundColor: '#dedede',
  },
  stepLabelContainer: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  stepHeaderLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  stepStatus: {
    fontSize: 12,
    backgroundColor: '#FFD700',
    padding: 5,
    borderRadius: 5,
  },
  activeStep: {
    color: 'black',
    fontWeight: 'bold',
  },
  inactiveStep: {
    color: '#999',
  },
  activeStatus: {
    backgroundColor: '#FFD700',
    color: 'black',
  },
  inactiveStatus: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  stepLabel: {
    fontSize: 15,
  },
  activeLabel: {
    color: 'black',
  },
  inactiveLabel: {
    color: '#999',
    fontWeight: 'bold',
  },
  noteContainer: {
    paddingHorizontal: 15,
    marginTop: 60,
  },
  noteTitle: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notes: {
    fontSize: 14,
    color: '#999',
    marginVertical: 2,
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 10,
  },
  continueBtn: {
    backgroundColor: 'blue',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderRadius: 10,
  },
  continueBtnText: {
    color: 'white',
    fontSize: 16,
  },
  disabledBtn: {
    backgroundColor: '#cccccc',
  },
});

export default AadhaarPANVerification;
