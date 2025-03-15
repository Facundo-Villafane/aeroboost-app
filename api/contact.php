<?php
// Permitir solicitudes desde el origen de tu aplicación React
// Reemplaza 'https://tudominio.com' con la URL de tu sitio
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Función para sanitizar entradas
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Verificar que sea una solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos del formulario
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
    $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';
    
    // Validar datos básicos
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode([
            'success' => false,
            'error' => 'Por favor, completa todos los campos requeridos.'
        ]);
        exit;
    }
    
    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'error' => 'Por favor, proporciona un correo electrónico válido.'
        ]);
        exit;
    }
    
    // Configurar el destinatario del correo
    $to = "info@email.com"; // Cambia esto a tu dirección de correo
    
    // Configurar el asunto
    $subject = "Nuevo mensaje de contacto desde el sitio web";
    
    // Configurar las cabeceras del correo
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $name <$email>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    
    // Configurar el cuerpo del mensaje
    $email_body = "
    <html>
    <head>
        <title>Nuevo mensaje de contacto</title>
    </head>
    <body>
        <h2>Nuevo mensaje de contacto desde el sitio web</h2>
        <table>
            <tr>
                <th style='text-align: left; padding: 8px;'>Nombre:</th>
                <td style='padding: 8px;'>$name</td>
            </tr>
            <tr>
                <th style='text-align: left; padding: 8px;'>Email:</th>
                <td style='padding: 8px;'>$email</td>
            </tr>
            <tr>
                <th style='text-align: left; padding: 8px;'>Teléfono:</th>
                <td style='padding: 8px;'>$phone</td>
            </tr>
            <tr>
                <th style='text-align: left; padding: 8px;'>Mensaje:</th>
                <td style='padding: 8px;'>$message</td>
            </tr>
        </table>
    </body>
    </html>
    ";
    
    // Intenta enviar el correo
    $mail_sent = mail($to, $subject, $email_body, $headers);
    
    // Verificar si el correo se envió correctamente
    if ($mail_sent) {
        // Opcional: Guardar en base de datos
        // Aquí podrías añadir código para guardar el mensaje en una base de datos MySQL
        
        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.'
        ]);
    } else {
        // Error al enviar el correo
        echo json_encode([
            'success' => false,
            'error' => 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.'
        ]);
    }
} else {
    // Si no es una solicitud POST
    echo json_encode([
        'success' => false,
        'error' => 'Método no permitido'
    ]);
}
?>
