<?php

namespace Runig006\FlarumBlogShare\Console;

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Started;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Console\Command;
use Illuminate\Contracts\Events\Dispatcher;
use V17Development\FlarumBlog\BlogMeta\BlogMeta;
use TelegramBot\Api\BotApi as TelegramBot;
use TelegramBot\Api\Types\Inline\InlineKeyboardMarkup as TelegramButton;

class ShareArticleCommand extends Command
{
    protected $signature = 'runig006:blog:share {--check=telegram}';
    protected $description = 'Check for any article that need sharing and publish one';

    protected $urlGenerator = null;
    protected $settings = null;

    public function __construct(UrlGenerator $urlGenerator, SettingsRepositoryInterface $settings)
    {
        $this->urlGenerator = $urlGenerator;
        $this->settings = $settings;
        parent::__construct();
    }

    public function handle(Dispatcher $dispatcher)
    {
        $check = $this->option('check');
        if ($this->settings->get("runig006-blog-share." . $check . "_enabled", false) == false) {
            return;
        }
        $discussion = Discussion::with(['blogMeta', 'blogShare'])->whereHas('blogMeta', function ($q) {
            $q->where('is_pending_review', 0);
        })->whereHas('blogShare', function ($q) use ($check) {
            $q->where($check . "_share", 1);
            $q->whereNull($check . "_shared");
        })->first();
        if ($discussion) {
            $this->$check($discussion);
            $discussion->blogShare[$check . "_shared"] = Carbon::now();
            $discussion->blogShare->save();
        }
    }


    public function telegram(Discussion $discussion)
    {
        $key = $this->settings->get("runig006-blog-share.telegram_token");
        $chat = $this->settings->get("runig006-blog-share.telegram_chat_id");


        $html = $this->getHtml($discussion, 'telegram');
        $buttons = $this->getTelegramButtons($discussion);
        $bot = new TelegramBot($key);

        $bot->sendMessage($chat, $html, 'html', false, null, $buttons);
    }

    private function getTelegramButtons(Discussion $discussion)
    {
        $share = $discussion->blogShare;

        $text = $share->telegram_button_text;
        $urls = $share->telegram_button_url;
        $rows = $share->telegram_button_rows;

        $text = explode(",", $text);
        $urls = explode(",", $urls);
        $rows = explode(",", $rows);

        $row = 0;
        $count = array_shift($rows) ?? $this->settings->get("runig006-blog-share.telegram_buttons_per_row", 1);
        foreach ($text as $k => $t) {
            if ($t && isset($urls[$k]) && $urls[$k]) {
                $buttons[$row][] = [
                    'text' => trim($t),
                    'url' => trim($urls[$k]),
                ];
                $count--;
                if ($count <= 0) {
                    $count = array_shift($rows) ?? $this->settings->get("runig006-blog-share.telegram_buttons_per_row", 1);
                    $row++;
                }
            }
        }
        $buttons[] = [
            [
                'text' => 'Ver en el foro',
                //'url' => $this->urlGenerator->to('forum')->route('blog.post', ['id' => $discussion->id])
                'url' => 'https://comuesp.com/',
            ]
        ];
        return new TelegramButton($buttons);
    }

    private function getHtml(Discussion $discussion, $check)
    {
        $meta = $discussion->blogMeta;
        $sharing = $discussion->blogShare;

        $html = "";
        $url = $this->urlGenerator->to('forum')->route('blog.post', ['id' => $discussion->id]);

        $title = $discussion->title;
        $body = null;

        if ($meta->title || $sharing[$check . '_title']) {
            $title = $meta->title ??  $sharing[$check . '_title'];
        }

        if ($meta->summary || $sharing[$check . '_body']) {
            $body = $meta->summary ??  $sharing[$check . '_body'];
        }

        if ($title) {
            $html .= "<b> $title </b> \n\n";
        }
        if ($body) {
            $html .= $body;
        }

        $html .= "\n\n<a href='$url'>Ver noticia</a>";
        return $html;
    }
}
