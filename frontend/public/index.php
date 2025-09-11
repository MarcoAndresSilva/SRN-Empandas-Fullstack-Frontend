<?php

use CodeIgniter\Boot;
use Config\Paths;

// Path to the front controller (this file)
define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);

// Location of the Paths config file.
$pathsPath = realpath(FCPATH . '../app/Config/Paths.php');

// Load the framework autoloader
require_once realpath(dirname($pathsPath) . '/../../vendor/codeigniter4/framework/system/ThirdParty/Composer/Autoloader.php');
require_once realpath(dirname($pathsPath) . '/../../app/Config/Autoload.php');
require_once realpath(dirname($pathsPath) . '/../../vendor/autoload.php');

// Create the Paths object
$paths = new Paths($pathsPath);

// Load the framework bootstrap file.
require_once $paths->systemDirectory . '/Boot.php';

// Boot the application
echo Boot::bootWeb($paths);