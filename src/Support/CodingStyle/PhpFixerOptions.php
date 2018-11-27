<?php

namespace Concrete\Core\Support\CodingStyle;

use Concrete\Core\Config\Repository\Repository;
use RuntimeException;

/**
 * Options for PhpFixer.
 */
class PhpFixerOptions
{
    /**
     * @var \Concrete\Core\Config\Repository\Repository
     */
    protected $config;

    /**
     * The absolute path to the web root directory.
     *
     * @var string|null
     */
    private $webRoot;

    /**
     * The directory names that should not be parsed.
     *
     * @var string[]|null
     */
    private $ignoredDirectoriesByName;

    /**
     * The directory paths (relative to the webroot) that should not be parsed (allowed placeholders: <HANDLE>).
     *
     * @var string[]|null
     */
    private $ignoredDirectoriesByPath;

    /**
     * The file paths (relative to the webroot) that are executed before checking the PHP version.
     *
     * @var string[]|null
     */
    private $bootstrapFiles;

    /**
     * The file paths (relative to the webroot) that only contain PHP and that don't follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @var string[]|null
     */
    private $phpOnlyNonPsr4Files;

    /**
     * The directory paths (relative to the webroot) that contain PHP-only files that don't follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @var string[]|null
     */
    private $phpOnlyNonPsr4Directories;

    /**
     * The regular expressions describing the paths (relative to the web root) that contain PHP-only files that don't follow PSR-4 class names.
     *
     * @var string[]|null
     */
    private $phpOnlyNonPsr4Regexs;

    /**
     * The file paths (relative to the webroot) that only contain PHP and that follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @var string[]|null
     */
    private $phpOnlyPsr4Files;

    /**
     * The directory paths (relative to the webroot) that contain PHP-only files that follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @var string[]|null
     */
    private $phpOnlyPsr4Directories;

    /**
     * The regular expressions describing the paths (relative to the web root) that contain PHP-only files that follow PSR-4 class names.
     *
     * @var string[]|null
     */
    private $phpOnlyPsr4Regexs;

    /**
     * The list of regular expressions that should be used to check if a directory contains files with mixed flags.
     *
     * @var string[]|null
     */
    private $directoriesWithMixedContentsRegex;

    /**
     * Initialize the instance.
     *
     * @param \Concrete\Core\Config\Repository\Repository $config
     */
    public function __construct(Repository $config)
    {
        $this->config = $config;
    }

    /**
     * Normalize a path.
     *
     * @param string $path the path to be normalized
     * @param bool $isDir is $path a directory?
     * @param bool $isRelative is $path relative to the webroot?
     *
     * @return string
     */
    public function normalizePath($path, $isDir, $isRelative)
    {
        $result = str_replace(DIRECTORY_SEPARATOR, '/', $path);
        if ($isRelative) {
            $result = ltrim($result, '/');
        }
        if ($isDir) {
            $result = rtrim($result, '/') . '/';
        }

        return $result;
    }

    /**
     * Get the absolute path to the web root directory.
     *
     * @return string
     */
    public function getWebRoot()
    {
        if ($this->webRoot === null) {
            $this->setWebRoot(DIR_BASE);
        }

        return $this->webRoot;
    }

    /**
     * Set the absolute path to the web root directory.
     *
     * @param string|mixed $value
     *
     * @throws \RuntimeException if $value is not a valid directory path
     *
     * @return $this
     */
    public function setWebRoot($value)
    {
        $absPath = is_string($value) && $value !== '' ? realpath($value) : false;
        if ($absPath === false || !is_dir($absPath)) {
            throw new RuntimeException(t('Unable to find the directory %s', $value));
        }
        $this->webRoot = $this->normalizePath($absPath, true, false);

        return $this;
    }

    /**
     * Get the directory names that should not be parsed.
     *
     * @return string[]
     */
    public function getIgnoredDirectoriesByName()
    {
        if ($this->ignoredDirectoriesByName === null) {
            $this->setIgnoredDirectoriesByName(preg_split('/\s+/', $this->config->get('concrete.misc.coding_style.php.ignore_directories.by_name'), -1, PREG_SPLIT_NO_EMPTY));
        }

        return $this->ignoredDirectoriesByName;
    }

    /**
     * Set the directory names that should not be parsed.
     *
     * @param string[] $value
     *
     * @return $this
     */
    public function setIgnoredDirectoriesByName(array $value)
    {
        $this->ignoredDirectoriesByName = $value;

        return $this;
    }

    /**
     * Get the directory paths (relative to the webroot) that should not be parsed (allowed placeholders: <HANDLE>).
     *
     * @return string[]
     */
    public function getIgnoredDirectoriesByPath()
    {
        if ($this->ignoredDirectoriesByPath === null) {
            $this->setIgnoredDirectoriesByPath(preg_split('/\s+/', $this->config->get('concrete.misc.coding_style.php.ignore_directories.by_path'), -1, PREG_SPLIT_NO_EMPTY));
        }

        return $this->ignoredDirectoriesByPath;
    }

    /**
     * Set the directory paths (relative to the webroot) that should not be parsed (allowed placeholders: <HANDLE>).
     *
     * @param string[] $value
     *
     * @return $this
     */
    public function setIgnoredDirectoriesByPath(array $value)
    {
        $ignoredDirectoriesByPath = [];
        foreach ($value as $path) {
            $ignoredDirectoriesByPath[] = $this->normalizePath($path, true, true);
        }
        $this->directoriesWithMixedContentsRegex = null;
        $this->ignoredDirectoriesByPath = $ignoredDirectoriesByPath;

        return $this;
    }

    /**
     * Get the file paths (relative to the webroot) that are executed before checking the PHP version.
     *
     * @return string[]
     */
    public function getBootstrapFiles()
    {
        if ($this->bootstrapFiles === null) {
            $this->setBootstrapFiles(preg_split('/\s+/', $this->config->get('concrete.misc.coding_style.php.bootstrap_files'), -1, PREG_SPLIT_NO_EMPTY));
        }

        return $this->bootstrapFiles;
    }

    /**
     * Set the file paths (relative to the webroot) that are executed before checking the PHP version.
     *
     * @param string[] $value
     *
     * @return $this
     */
    public function setBootstrapFiles(array $value)
    {
        $bootstrapFiles = [];
        foreach ($value as $path) {
            $bootstrapFiles[] = $this->normalizePath($path, false, true);
        }
        $this->directoriesWithMixedContentsRegex = null;
        $this->bootstrapFiles = $bootstrapFiles;

        return $this;
    }

    /**
     * Get the file paths (relative to the webroot) that only contain PHP and that don't follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @return string[]
     */
    public function getPhpOnlyNonPsr4Files()
    {
        if ($this->phpOnlyNonPsr4Files === null) {
            $this->setPhpOnlyNonPsr4Files(preg_split('/\s+/', $this->config->get('concrete.misc.coding_style.php.php_only.non_psr4.files'), -1, PREG_SPLIT_NO_EMPTY));
        }

        return $this->phpOnlyNonPsr4Files;
    }

    /**
     * Set the file paths (relative to the webroot) that only contain PHP and that don't follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @param string[] $value
     *
     * @return $this
     */
    public function setPhpOnlyNonPsr4Files(array $value)
    {
        $phpOnlyNonPsr4Files = [];
        foreach ($value as $path) {
            $phpOnlyNonPsr4Files[] = $this->normalizePath($path, false, true);
        }
        $this->directoriesWithMixedContentsRegex = null;
        $this->phpOnlyNonPsr4Regexs = null;
        $this->phpOnlyNonPsr4Files = $phpOnlyNonPsr4Files;

        return $this;
    }

    /**
     * Get the directory paths (relative to the webroot) that contain PHP-only files that don't follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @return string[]
     */
    public function getPhpOnlyNonPsr4Directories()
    {
        if ($this->phpOnlyNonPsr4Directories === null) {
            $this->setPhpOnlyNonPsr4Directories(preg_split('/\s+/', $this->config->get('concrete.misc.coding_style.php.php_only.non_psr4.directories'), -1, PREG_SPLIT_NO_EMPTY));
        }

        return $this->phpOnlyNonPsr4Directories;
    }

    /**
     * Set the directory paths (relative to the webroot) that contain PHP-only files that don't follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @param string[] $value
     *
     * @return $this
     */
    public function setPhpOnlyNonPsr4Directories(array $value)
    {
        $phpOnlyNonPsr4Directories = [];
        foreach ($value as $path) {
            $phpOnlyNonPsr4Directories[] = $this->normalizePath($path, true, true);
        }
        $this->directoriesWithMixedContentsRegex = null;
        $this->phpOnlyNonPsr4Regexs = null;
        $this->phpOnlyNonPsr4Directories = $phpOnlyNonPsr4Directories;

        return $this;
    }

    /**
     * Get the regular expressions describing the paths (relative to the web root) that contain PHP-only files that don't follow PSR-4 class names.
     *
     * @return string[]
     */
    public function getPhpOnlyNonPsr4Regexs()
    {
        if ($this->phpOnlyNonPsr4Regexs === null) {
            $phpOnlyNonPsr4Regexs = [];
            foreach ($this->getPhpOnlyNonPsr4Files() as $pattern) {
                $phpOnlyNonPsr4Regexs[] = '/^' . str_replace('\<HANDLE\>', '\w+', preg_quote($pattern, '/')) . '$/';
            }
            foreach ($this->getPhpOnlyNonPsr4Directories() as $pattern) {
                $phpOnlyNonPsr4Regexs[] = '/^' . str_replace('\<HANDLE\>', '\w+', preg_quote($pattern, '/')) . '/';
            }
            $this->phpOnlyNonPsr4Regexs = $phpOnlyNonPsr4Regexs;
        }

        return $this->phpOnlyNonPsr4Regexs;
    }

    /**
     * Get the file paths (relative to the webroot) that only contain PHP and that follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @return string[]
     */
    public function getPhpOnlyPsr4Files()
    {
        if ($this->phpOnlyPsr4Files === null) {
            $this->setPhpOnlyPsr4Files(preg_split('/\s+/', $this->config->get('concrete.misc.coding_style.php.php_only.psr4.files'), -1, PREG_SPLIT_NO_EMPTY));
        }

        return $this->phpOnlyPsr4Files;
    }

    /**
     * Set the file paths (relative to the webroot) that only contain PHP and that follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @param string[] $value
     *
     * @return $this
     */
    public function setPhpOnlyPsr4Files(array $value)
    {
        $phpOnlyPsr4Files = [];
        foreach ($value as $path) {
            $phpOnlyPsr4Files[] = $this->normalizePath($path, false, true);
        }
        $this->directoriesWithMixedContentsRegex = null;
        $this->phpOnlyPsr4Regexs = null;
        $this->phpOnlyPsr4Files = $phpOnlyPsr4Files;

        return $this;
    }

    /**
     * Get the directory paths (relative to the webroot) that contain PHP-only files that follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @return string[]
     */
    public function getPhpOnlyPsr4Directories()
    {
        if ($this->phpOnlyPsr4Directories === null) {
            $this->setPhpOnlyPsr4Directories(preg_split('/\s+/', $this->config->get('concrete.misc.coding_style.php.php_only.psr4.directories'), -1, PREG_SPLIT_NO_EMPTY));
        }

        return $this->phpOnlyPsr4Directories;
    }

    /**
     * Set the directory paths (relative to the webroot) that contain PHP-only files that follow PSR-4 class names (allowed placeholders: <HANDLE>).
     *
     * @param string[] $value
     *
     * @return $this
     */
    public function setPhpOnlyPsr4Directories(array $value)
    {
        $phpOnlyPsr4Directories = [];
        foreach ($value as $path) {
            $phpOnlyPsr4Directories[] = $this->normalizePath($path, true, true);
        }
        $this->directoriesWithMixedContentsRegex = null;
        $this->phpOnlyPsr4Regexs = null;
        $this->phpOnlyPsr4Directories = $phpOnlyPsr4Directories;

        return $this;
    }

    /**
     * Get the regular expressions describing the paths (relative to the web root) that contain PHP-only files that don't follow PSR-4 class names.
     *
     * @return string[]
     */
    public function getPhpOnlyPsr4Regexs()
    {
        if ($this->phpOnlyPsr4Regexs === null) {
            $phpOnlyPsr4Regexs = [];
            foreach ($this->getPhpOnlyPsr4Files() as $pattern) {
                $phpOnlyPsr4Regexs[] = '/^' . str_replace('\<HANDLE\>', '\w+', preg_quote($pattern, '/')) . '$/';
            }
            foreach ($this->getPhpOnlyPsr4Directories() as $pattern) {
                $phpOnlyPsr4Regexs[] = '/^' . str_replace('\<HANDLE\>', '\w+', preg_quote($pattern, '/')) . '/';
            }
            $this->phpOnlyPsr4Regexs = $phpOnlyPsr4Regexs;
        }

        return $this->phpOnlyPsr4Regexs;
    }

    /**
     * Check if a directory contains PHP files with mixed flags.
     *
     * @param string $path the normalized relative path of the directory
     *
     * @return bool
     */
    public function isDirectoryWithMixedContents($path)
    {
        foreach ($this->getDirectoriesWithMixedContentsRegex() as $rx) {
            if (preg_match($rx, $path)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the list of regular expressions that should be used to check if a directory contains files with mixed flags.
     *
     * @return string[]
     */
    protected function getDirectoriesWithMixedContentsRegex()
    {
        if ($this->directoriesWithMixedContentsRegex === null) {
            $directoriesWithMixedContentsRegex = [];
            foreach ($this->getIgnoredDirectoriesByPath() as $path) {
                $this->addDirectoriesWithMixedContentsRegex($path, $directoriesWithMixedContentsRegex);
            }
            foreach ($this->getBootstrapFiles() as $path) {
                $this->addDirectoriesWithMixedContentsRegex($path, $directoriesWithMixedContentsRegex);
            }
            foreach ($this->getPhpOnlyNonPsr4Files() as $path) {
                $this->addDirectoriesWithMixedContentsRegex($path, $directoriesWithMixedContentsRegex);
            }
            foreach ($this->getPhpOnlyNonPsr4Directories() as $path) {
                $this->addDirectoriesWithMixedContentsRegex($path, $directoriesWithMixedContentsRegex);
            }
            foreach ($this->getPhpOnlyPsr4Files() as $path) {
                $this->addDirectoriesWithMixedContentsRegex($path, $directoriesWithMixedContentsRegex);
            }
            foreach ($this->getPhpOnlyPsr4Directories() as $path) {
                $this->addDirectoriesWithMixedContentsRegex($path, $directoriesWithMixedContentsRegex);
            }
            $this->directoriesWithMixedContentsRegex = $directoriesWithMixedContentsRegex;
        }

        return $this->directoriesWithMixedContentsRegex;
    }

    /**
     * Add items to the list of regular expressions that should be used to check if a directory contains files with mixed flags.
     *
     * @param string $path the normalized relative path
     * @param array $directoriesWithMixedContentsRegex
     */
    protected function addDirectoriesWithMixedContentsRegex($path, array &$directoriesWithMixedContentsRegex)
    {
        // Remove the trailing slash (for directories)
        $pathWithoutLeadingSlash = rtrim($path, '/');
        // Remove the last name
        $lastSlashPosition = strrpos($pathWithoutLeadingSlash, '/');
        $containingDirectoryPath = $lastSlashPosition === false ? '' : substr($pathWithoutLeadingSlash, 0, $lastSlashPosition);
        $regexes = ['/^\/$/'];
        if ($containingDirectoryPath !== '') {
            $relativePath = '';
            $dirnames = explode('/', $containingDirectoryPath);
            for (; ;) {
                $dirname = array_shift($dirnames);
                if ($dirname === null) {
                    break;
                }
                $relativePath .= $dirname . '/';
                $regexes[] = '/^' . str_replace('\<HANDLE\>', '\w+', preg_quote($relativePath, '/')) . '$/';
            }
        }

        foreach ($regexes as $regex) {
            if (!in_array($regex, $directoriesWithMixedContentsRegex, true)) {
                $directoriesWithMixedContentsRegex[] = $regex;
            }
        }
    }
}
