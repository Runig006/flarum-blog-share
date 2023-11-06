<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('blog_share')) {
            $schema->create('blog_share', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('discussion_id')->unsigned();
                $table->boolean('telegram_share')->default(0);
                $table->dateTime('telegram_shared')->nullable(true);
                $table->string('telegram_title')->nullable(true);
                $table->string('telegram_body')->nullable(true);
                $table->string('telegram_button_text')->nullable(true);
                $table->string('telegram_button_url')->nullable(true);
                $table->string('telegram_button_rows')->nullable(true);


                $table->foreign('discussion_id')->references('id')->on('discussions')->onDelete('cascade');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->drop('blog_share');
    },
];
