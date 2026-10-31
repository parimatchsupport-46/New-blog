import ComplainForm from '../../components/ComplainForm'

/** Bonus Complain — form ka saara logic ComplainForm me hai. */
export default function BonusComplain() {
  return (
    <ComplainForm
      type="Bonus"
      title="Bonus Complain"
  files={[{ key: 'issueImage', label: 'Upload Issue Image' }]}
      requiredFilesMessage="Please upload Issue Image"
    />
  )
}
