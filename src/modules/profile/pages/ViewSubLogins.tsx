import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { getSubLoginList } from '../../../utils/apiservice';
import colors from '../../../../colors';

const ViewSubLogins: React.FC = () => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        // Fetch data from API when the component mounts
        fetchData();
    }, []);

    const fetchData = async () => {
        getSubLoginList()
            .then(response => response.data)
            .then((responseData) => {
                setTableData(responseData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const tableHead = ['Name', 'Contact No', 'Password'];

    const renderRows = () => {
        if (!Array.isArray(tableData) || tableData.length === 0) {
            return (
                <Row
                    data={['No Data']}
                    textStyle={[styles.text, { textAlign: 'center' }]}
                />
            );
        }

        return tableData.map((sublogin, index) => (
            <Row
                key={index}
                data={[sublogin.name, sublogin.mobileNo, sublogin.password]}
                textStyle={styles.text}
                style={styles.row}
            />
        ));
    };

    return (
        <ScrollView style={styles.container}>
            <Table borderStyle={{ borderWidth: 1, borderColor: colors.lightGrey }}>
                <Row data={tableHead} style={styles.head} textStyle={styles.headText} />
                {renderRows()}
            </Table>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },
    head: { 
        backgroundColor: colors.lightLightGrey,
    },
    text: { 
        paddingVertical: 2,
        color: colors.black,
        paddingLeft: 10
    },
    headText: { 
        color: colors.black,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingVertical: 5,
    },
});

export default ViewSubLogins;
