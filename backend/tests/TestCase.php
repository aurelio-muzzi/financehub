<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    public function createApplication()
    {
        // Força isolamento das variáveis de ambiente de teste
        putenv('DB_CONNECTION=sqlite');
        putenv('DB_DATABASE=:memory:');
        $_ENV['DB_CONNECTION'] = 'sqlite';
        $_ENV['DB_DATABASE'] = ':memory:';
        $_SERVER['DB_CONNECTION'] = 'sqlite';
        $_SERVER['DB_DATABASE'] = ':memory:';

        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        $app['config']->set('database.default', 'sqlite');
        $app['config']->set('database.connections.sqlite.database', ':memory:');

        return $app;
    }

    protected function setUp(): void
    {
        parent::setUp();

        // Proteção adicional de integridade
        $connection = config('database.default');
        if ($connection !== 'sqlite') {
            $database = config("database.connections.{$connection}.database");
            if ($database === 'financehub') {
                throw new RuntimeException(
                    "ERRO DE SEGURANÇA: Testes automatizados tentaram executar contra o banco de desenvolvimento '{$database}'! ".
                    'Os testes devem utilizar apenas SQLite em memória (:memory:).'
                );
            }
        }
    }
}
