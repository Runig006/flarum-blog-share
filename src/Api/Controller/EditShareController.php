<?php

namespace Runig006\FlarumBlogShare\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Runig006\FlarumBlogShare\Api\Serializer\ShareSerializer;
use Runig006\FlarumBlogShare\Entities\BlogShare;

class EditShareController extends AbstractShowController
{
    public $serializer = ShareSerializer::class;

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $data = $request->getParsedBody();
        $actor = RequestUtil::getActor($request);
        $actor->assertCan('blog-share.autoShare');

        $object = [];
        $blogShare = BlogShare::findOrFail(Arr::get($data, 'data.id'));
        $attributes = Arr::get($data, 'data.attributes');
        foreach ($attributes as $mode => $values) {
            foreach ($values as $name => $v)
                $object[$mode . "_" . $name] = $v;
        }
        $blogShare->fill($object);
        $blogShare->save();
        return $blogShare;
    }
}
