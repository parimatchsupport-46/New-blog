import ComplainForm from '../../components/ComplainForm'

/** Deposit Complain — form ka saara logic ComplainForm me hai. */
export default function DepositComplain() {
  return (
    <ComplainForm
      type="Deposit"
      title="Deposit Complain"
  amount={{ key: 'depositAmount', label: 'Deposit Amount' }}
  files={[{ key: 'paymentImage', label: 'Upload Payment Image' }]}
      requiredFilesMessage="Please upload Payment Image"
    />
  )
}
