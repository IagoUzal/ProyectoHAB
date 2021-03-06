/*
  TODO:
    - Mejorar el procesado de imagen, diferenciar entre avatar e imagen de mensaje
*/

require('dotenv').config();
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const uuid = require('uuid');
const Crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

// Procesando y guardando imagen

const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);

async function processAndSaveImage(messageImage) {
  // Comprobando si existe el directorio
  await fs.ensureDir(imageUploadPath);
  // Generando nombre aleatorio con uuid
  const savedImageName = `${uuid.v1()}.jpg`;
  // Procesando imagen con sharp
  const finalImage = sharp(messageImage.data).resize(500);

  //Guardamos la imagen
  await finalImage.toFile(path.join(imageUploadPath, savedImageName));

  //Devolvemos el nombre de la imagen
  return savedImageName;
}

// Borrar imagen

async function deleteImage(imagePath) {
  await fs.unlink(path.join(imageUploadPath, imagePath));
}

// Generador de errores

function generateError(message, code) {
  const error = new Error(message);
  if (code) error.httpCode = code;
  return error;
}

// Random string

function randomString(size = 20) {
  return Crypto.randomBytes(size).toString('hex').slice(0, size);
}

// Send email

async function sendEmail({ email, title, content }) {
  sgMail.setApiKey(process.env.SENDGRID_KEY);

  const msg = {
    to: email,
    from: 'iagouzal@gmail.com',
    subject: title,
    text: content,
    html: `<h1>Valida tu email</h1><p>${content}</p>`,
  };

  await sgMail.send(msg);
}

module.exports = { processAndSaveImage, deleteImage, generateError, randomString, sendEmail };
