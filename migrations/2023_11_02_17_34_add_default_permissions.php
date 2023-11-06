<?php

use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'blog-share.autoShare' => Group::MODERATOR_ID,
]);