import fs from 'node:fs/promises'
import path from 'node:path'

const generateEnvExample = async (fileName = '.env'): Promise<void> => {
  const exampleEnvFileName = `${fileName}.example`
  const exampleEnvFilePath = path.resolve(process.cwd(), exampleEnvFileName)
  try {
    const filePath = path.resolve(process.cwd(), fileName)
    // check whether file exists in the project root directory or not
    const fileHandle = await fs.open(filePath, 'r')
    // delete the previous file before generating a new one
    await fs.rm(exampleEnvFilePath, { force: true })
    const fileContent = await fileHandle.readFile({ encoding: 'utf-8' })
    const fileLines = fileContent.split('\n').filter(Boolean)
    for (const fileLine of fileLines) {
      const shouldReplace = fileLine.includes('#replace')
      const parseFileLine = fileLine.replace('#replace', '')
      const [key, value] = parseFileLine.split('=')
      const envFileValue = shouldReplace ? `"ENTER YOUR ${key} HERE"` : value
      const envFileLine = `${key}=${envFileValue}\n`
      await fs.writeFile(exampleEnvFilePath, envFileLine, { flag: 'a' })
    }
    console.log(`File ${exampleEnvFileName} generated`)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log(`File ${fileName} not found`)
      return
    }
    console.log(error)
  }
}
generateEnvExample()
