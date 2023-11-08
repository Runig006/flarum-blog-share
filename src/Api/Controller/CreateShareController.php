<?php

namespace Runig006\FlarumBlogShare\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Discussion\DiscussionRepository;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Runig006\FlarumBlogShare\Api\Serializer\ShareSerializer;
use Runig006\FlarumBlogShare\Entities\BlogShare;

class CreateShareController extends AbstractCreateController
{
    public $serializer = ShareSerializer::class;
    private $discussionRepository = null;

    public function __construct(DiscussionRepository $discussionRepository)
    {
        $this->discussionRepository = $discussionRepository;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $data = $request->getParsedBody();
        $actor = RequestUtil::getActor($request);
        $actor->assertCan('blog-share.autoShare');

        $discussionId = Arr::get($data, 'data.relationships.discussion.data.id');
        $discussion = $this->discussionRepository->findOrFail($discussionId, $actor);


        $blogShare = $discussion->blogShare ?? new BlogShare();
        $object = [
            'discussion_id' => $discussion->id,
        ];
        $attributes = Arr::get($data, 'data.attributes');
        foreach ($attributes as $mode => $values) {
            foreach ($values as $name => $v)
                $object[$mode . "_" . $name] = $v ?? null;
        }
        $blogShare->fill($object);
        $blogShare->save();
        return $blogShare;
    }
}
