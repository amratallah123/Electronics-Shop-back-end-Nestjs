import {
  applyDecorators,
  UseInterceptors,
  UnsupportedMediaTypeException,
} from '@nestjs/common'

import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

import { ApiBody, ApiConsumes } from '@nestjs/swagger'

import { Request } from 'express'
import { diskStorage } from 'multer'
import { nanoid } from 'nanoid'

import { UploadFields } from './types'

function getFileName(fileName: string) {
  const [name, extension] = fileName
    .toLocaleLowerCase()
    .replace(/ /g, '_')
    .split('.')
  return `${nanoid()}__${name}.${extension}`
}

export function fileTypeFilter(...types: string[]) {
  return (
    _: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (types.some((m) => file.mimetype.includes(m))) {
      callback(null, true)
    } else {
      callback(
        new UnsupportedMediaTypeException(
          `File type is not matching: ${types.join(', ')}`,
        ),
        false,
      )
    }
  }
}

export function UploadFile(
  fieldName: string = 'file',
  required: boolean = false,
  localOptions?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  )
}

export function UploadFiles(
  fieldName: string = 'files',
  required: boolean = false,
  maxCount: number = 10,
  localOptions?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  )
}

export function UploadFileFields(
  uploadFields: UploadFields[],
  localOptions?: MulterOptions,
) {
  const bodyProperties: Record<string, SchemaObject | ReferenceObject> =
    Object.assign(
      {},
      ...uploadFields.map((field) => {
        return { [field.name]: { type: 'string', format: 'binary' } }
      }),
    )
  const apiBody = ApiBody({
    schema: {
      type: 'object',
      properties: bodyProperties,
      required: uploadFields.filter((f) => f.required).map((f) => f.name),
    },
  })

  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(uploadFields, localOptions)),
    ApiConsumes('multipart/form-data'),
    apiBody,
  )
}

export function UploadImage(
  fileName: string = 'image',
  required: boolean = false,
  destination: string = './public/photos/',
) {
  return UploadFile(fileName, required, {
    fileFilter: fileTypeFilter('image'),
    storage: diskStorage({
      destination,
      filename: (_, file, cb) => {
        cb(null, getFileName(file.originalname))
      },
    }),
  })
}

export function UploadImages(
  fileName: string = 'images',
  required: boolean = false,
  destination: string = './public/photos/',
  max: number = 10,
) {
  return UploadFiles(fileName, required, max, {
    fileFilter: fileTypeFilter('image'),
    storage: diskStorage({
      destination,
      filename: (_, file, cb) => {
        cb(null, getFileName(file.originalname))
      },
    }),
  })
}

export function UploadPDF(
  fileName: string = 'document',
  required: boolean = false,
  destination: string = './public/docs/',
) {
  return UploadFile(fileName, required, {
    fileFilter: fileTypeFilter('pdf'),
    storage: diskStorage({
      destination,
      filename: (_, file, cb) => {
        cb(null, getFileName(file.originalname))
      },
    }),
  })
}

export function UploadPDFs(
  fileName: string = 'document',
  required: boolean = false,
  destination: string = './public/docs/',
  max: number = 10,
) {
  return UploadFiles(fileName, required, max, {
    fileFilter: fileTypeFilter('pdf'),
    storage: diskStorage({
      destination,
      filename: (_, file, cb) => {
        cb(null, getFileName(file.originalname))
      },
    }),
  })
}
