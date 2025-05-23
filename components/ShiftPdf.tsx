'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from '@react-pdf/renderer'
import { ShiftSlot } from '@/types'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
  },
  cellHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  cell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    width: '33%',
    textAlign: 'center',
  },
})

type Props = {
  className: string
  date: string
  slots: ShiftSlot[]
}

export function ShiftPdf({ className, date, slots }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>シフト表：{className}</Text>
        <Text style={styles.subtitle}>生成日：{date}</Text>

        <View style={styles.table}>
          <View style={[styles.row, styles.cellHeader]}>
            <Text style={styles.cell}>区分</Text>
            <Text style={styles.cell}>時間帯</Text>
            <Text style={styles.cell}>保育士人数</Text>
          </View>
          {slots.map((slot, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.cell}>{slot.label}</Text>
              <Text style={styles.cell}>{slot.time}</Text>
              <Text style={styles.cell}>{slot.required_staff}人</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
