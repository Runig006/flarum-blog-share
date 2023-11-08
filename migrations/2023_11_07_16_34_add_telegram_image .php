<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('blog_share', function (Blueprint $table) {
            $table->string('telegram_image')->nullable(true);
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('blog_share', function (Blueprint $table) {
            $table->dropColumn('telegram_image');
        });
    },
];
