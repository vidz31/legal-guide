// Mock react-dropzone for the upload functionality
export function useDropzone(options: {
  onDrop: (files: File[]) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  disabled?: boolean
}) {
  const { onDrop, disabled } = options

  const getRootProps = () => ({
    onClick: () => {
      if (disabled) return
      const input = document.createElement("input")
      input.type = "file"
      input.accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg"
      input.onchange = (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || [])
        onDrop(files)
      }
      input.click()
    },
  })

  const getInputProps = () => ({
    style: { display: "none" },
  })

  return {
    getRootProps,
    getInputProps,
    isDragActive: false,
  }
}
